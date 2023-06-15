from django.shortcuts import render, get_object_or_404
from rest_framework import request, response
from .models import Recipe, Comment, Like, UserAccount
from django.http import JsonResponse
from .serializers import RecipeSerializer, CommentSerializer, LikeSerializer
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django.core.serializers import serialize


@api_view(['POST'])
def create_recipe(request):
    """
    Create a new recipe.

    Args:
        request: The HTTP request object.

    Returns:
        A JSON response containing the created recipe or error messages.
    """
    serializer = RecipeSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save(user=request.user)
        return JsonResponse(serializer.data, status=201)
    return JsonResponse(serializer.errors, status=400)


@api_view(['DELETE'])
def delete_recipe(request, recipe_id):
    """
    Delete a recipe.

    Args:
        request: The HTTP request object.
        recipe_id: The ID of the recipe to delete.

    Returns:
        A JSON response indicating the success or failure of the operation.
    """
    recipe = get_object_or_404(Recipe, id=recipe_id)

    # Check if the authenticated user is the owner of the recipe
    if request.user == recipe.user:
        recipe.delete()
        return JsonResponse({'message': 'Recipe deleted successfully.'}, status=200)
    else:
        return JsonResponse({'error': 'You are not authorized to delete this recipe.'}, status=403)


@api_view(['GET'])
def get_user_recipes(request):
    """
    Get recipes created by the user.

    Args:
        request: The HTTP request object.

    Returns:
        A JSON response containing the recipes created by the user.
    """
    recipes = Recipe.objects.filter(user=request.user)
    serialized_recipes = []
    for recipe in recipes:
        user = UserAccount.objects.get(id=recipe.user_id)
        recipe_data = RecipeSerializer(recipe).data
        recipe_data['user'] = user.name
        serialized_recipes.append(recipe_data)
    return Response(serialized_recipes, status=200)


@api_view(['PATCH'])
def edit_recipe(request):
    """
    Edit a recipe.

    Args:
        request: The HTTP request object.

    Returns:
        A JSON response containing the updated recipe or error messages.
    """
    recipe_id = request.data.get('recipe_id')
    try:
        recipe = Recipe.objects.get(id=recipe_id)
    except Recipe.DoesNotExist:
        return Response({'message': 'Recipe not found.'}, status=404)

    if request.user == recipe.user:
        serializer = RecipeSerializer(recipe, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=200)
        else:
            return Response(serializer.errors, status=400)
    else:
        return Response({'message': 'This is not your recipe.'}, status=403)


@api_view(['GET'])
@authentication_classes([])
@permission_classes([AllowAny])
def display_all(request):
    """
    Display all recipes with associated details.

    Args:
        request: The HTTP request object.

    Returns:
        A JSON response containing all recipes with additional details like user, likes, and comments.
    """
    recipes = Recipe.objects.all()
    serialized_recipes = []
    for recipe in recipes:
        user = UserAccount.objects.get(id=recipe.user_id)
        recipe_data = RecipeSerializer(recipe).data
        recipe_data['user'] = user.name
        recipe_data['total_likes'] = Like.objects.filter(recipe=recipe).count()
        comments = Comment.objects.filter(recipe=recipe)
        serialized_comments = []
        for comment in comments:
            comment_user = UserAccount.objects.get(id=comment.user_id)
            serialized_comments.append({
                'content': comment.content,
                'date': comment.created_at,
                'user': comment_user.name,
            })
        recipe_data['all_comments'] = serialized_comments
        serialized_recipes.append(recipe_data)

    return Response(serialized_recipes, status=200)


@api_view(['POST'])
def create_comment(request):
    """
    Create a new comment for a recipe.

    Args:
        request: The HTTP request object.

    Returns:
        A JSON response containing the created comment or error messages.
    """
    recipe_id = request.data.get('recipe')
    recipe = get_object_or_404(Recipe, id=recipe_id)

    serializer = CommentSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save(recipe=recipe, user=request.user)
        return Response(serializer.data, status=201)
    return Response(serializer.errors, status=400)


@api_view(['GET'])
@authentication_classes([])
@permission_classes([AllowAny])
def get_specific_recipe(request, recipe_id):
    """
    Get a specific recipe with associated details.

    Args:
        request: The HTTP request object.
        recipe_id: The ID of the recipe to retrieve.

    Returns:
        A JSON response containing the requested recipe with additional details like user, likes, and comments.
    """
    recipe = get_object_or_404(Recipe, id=recipe_id)
    serialized_recipes = []
    user = UserAccount.objects.get(id=recipe.user_id)
    recipe_data = RecipeSerializer(recipe).data
    recipe_data['user'] = user.name
    recipe_data['total_likes'] = Like.objects.filter(recipe=recipe).count()
    comments = Comment.objects.filter(recipe=recipe)
    serialized_comments = []
    for comment in comments:
        comment_user = UserAccount.objects.get(id=comment.user_id)
        serialized_comments.append({
            'content': comment.content,
            'date': comment.created_at,
            'user': comment_user.name,
        })
    recipe_data['all_comments'] = serialized_comments
    serialized_recipes.append(recipe_data)

    return Response(serialized_recipes, status=200)


@api_view(['GET'])
@authentication_classes([])
@permission_classes([AllowAny])
def get_comments(request):
    """
    Get comments for a recipe.

    Args:
        request: The HTTP request object.

    Returns:
        A JSON response containing the comments for the specified recipe.
    """
    recipe_id = request.data.get('recipe_id')
    recipe = get_object_or_404(Recipe, id=recipe_id)
    comments = recipe.comments.all()
    serializer = CommentSerializer(comments, many=True)
    if len(comments) > 0:
        return Response(serializer.data)
    else:
        return Response({"error": "No comments found"})


@api_view(['DELETE'])
def delete_comment(request):
    """
    Delete a comment.

    Args:
        request: The HTTP request object.

    Returns:
        A JSON response indicating the success or failure of the operation.
    """
    comment_id = request.data.get('comment_id')
    comment = get_object_or_404(Comment, id=comment_id)
    if comment.user == request.user:
        comment.delete()
        return Response({'message': 'Comment deleted successfully.'}, status=204)
    return Response({'message': 'You are not authorized to delete this comment.'}, status=403)


@api_view(['POST'])
def toggle_like(request):
    """
    Toggle a like for a recipe.

    Args:
        request: The HTTP request object.

    Returns:
        A JSON response indicating the success or failure of the operation.
    """
    recipe_id = request.data.get('recipe_id')
    recipe = get_object_or_404(Recipe, id=recipe_id)

    if not request.user.is_authenticated:
        return Response({'error': 'You must be logged in to like a recipe.'}, status=401)

    # Check if a like already exists for the given recipe and user
    try:
        like = Like.objects.get(recipe=recipe, user=request.user)
        like.delete()
        message = 'unliked'
    except Like.DoesNotExist:
        Like.objects.create(recipe=recipe, user=request.user)
        message = 'liked'

    return Response({'message': message}, status=200)


@api_view(['GET'])
def get_liked_recipes(request):
    """
    Get recipes liked by the user.

    Args:
        request: The HTTP request object.

    Returns:
        A JSON response containing the IDs of recipes liked by the user.
    """
    liked_recipe_ids = Recipe.objects.filter(likes__user=request.user).values_list('id', flat=True)
    return Response(liked_recipe_ids, status=200)
