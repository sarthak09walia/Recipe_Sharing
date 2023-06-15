from django.http import JsonResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import UserAccount, Friendship
from .serializers import FriendshipSerializer, UserSerializer
from recipe.models import Recipe
from recipe.serializers import RecipeSerializer


@api_view(['POST'])
def update_image(request, email):
    """
    Update the image of a user.

    Args:
        request: The HTTP request object.
        email: The email of the user to update.

    Returns:
        A JSON response indicating the success or failure of the operation.
    """
    if request.method == 'POST' and request.FILES.get('image'):
        try:
            user = UserAccount.objects.get(email=email)
        except UserAccount.DoesNotExist:
            return JsonResponse({'success': False, 'error': 'User not found'})

        if request.user != user:
            return JsonResponse({'success': False, 'error': 'Unauthorized'})

        user.image = request.FILES['image']
        user.save()
        return JsonResponse({'success': True})
    return JsonResponse({'success': False, 'error': 'Invalid request'})


@api_view(['GET'])
def search_user(request, query):
    """
    Search for users by name.

    Args:
        request: The HTTP request object.

    Returns:
        A JSON response containing the search results or a message if no data is found.
    """
    print('request', request)
    name = query
    print(name)
    user_name = UserAccount.objects.filter(name__icontains=name)
    serializer = UserSerializer(user_name, many=True)
    serialized_data = serializer.data
    if len(serialized_data) > 0:
        return JsonResponse({'result': serialized_data})
    else:
        return JsonResponse({'result': 'No data found'})
    # return JsonResponse({'result': 'No data found'})


@api_view(['GET'])
def specific_user_details(request, user_id):
    """
        Search for users details by user id.

        Args:
            request: The HTTP request object.

        Returns:
            A JSON response containing the user details or a message if no data is found.
        """
    user_details = UserAccount.objects.filter(id=user_id)
    serializer = UserSerializer(user_details, many=True)
    serialized_data = serializer.data

    recipes = Recipe.objects.filter(user_id=user_id)
    serialized_recipes = RecipeSerializer(recipes, many=True)
    serialized = serialized_recipes.data
    return Response({'user': serialized_data, 'recipes': serialized}, status=status.HTTP_200_OK)


@api_view(['POST'])
def create_friend_request(request):
    """
    Create a friend request.

    Args:
        request: The HTTP request object.

    Returns:
        A JSON response indicating the success or failure of the operation.
    """
    recipient_id = request.data.get('recipient_id')
    user_id = request.user.id
    try:
        recipient = UserAccount.objects.get(id=recipient_id)
    except UserAccount.DoesNotExist:
        return Response({'error': 'Recipient does not exist.'}, status=status.HTTP_404_NOT_FOUND)

    if Friendship.objects.filter(requester_id=user_id, recipient_id=recipient_id).exists():
        return Response({'error': 'Friendship request already sent.'}, status=status.HTTP_400_BAD_REQUEST)

    friendship_request = Friendship.objects.create(requester_id=user_id, recipient_id=recipient_id,
                                                   status=Friendship.FriendshipStatus.PENDING)

    return Response({'success': 'Friendship request sent.'}, status=status.HTTP_201_CREATED)


@api_view(['GET'])
def get_user_send_requests(request):
    """
    Get friendship requests sent by the user.

    Args:
        request: The HTTP request object.

    Returns:
        A JSON response containing the friendship requests sent by the user.
    """
    user_id = request.user.id
    requests = Friendship.objects.filter(requester_id=user_id, status='pending')
    serializer = FriendshipSerializer(requests, many=True)
    return Response({'requests': serializer.data})


@api_view(['GET'])
def get_user_friends(request):
    """
    Get the friends of the user.

    Args:
        request: The HTTP request object.

    Returns:
        A JSON response containing the friends of the user.
    """
    user_id = request.user.id
    requests = Friendship.objects.filter(requester_id=user_id, status='accepted')
    serializer = FriendshipSerializer(requests, many=True)
    return Response({'Friends': serializer.data})


@api_view(['POST'])
def accept_friendship_request(request):
    """
    Accept a friendship request.

    Args:
        request: The HTTP request object.

    Returns:
        A JSON response indicating the success or failure of the operation.
    """
    friendship_id = request.data.get('friendship_id')
    try:
        friendship = Friendship.objects.get(id=friendship_id, status='pending')
        recipient = friendship.recipient
        print(recipient)
        if not recipient:
            return Response({'error': 'Recipient does not exist.'}, status=status.HTTP_400_BAD_REQUEST)

        friendship.status = 'accepted'
        friendship.save()
        serializer = FriendshipSerializer(friendship)
        return Response({'success': 'Request Accepted'}, status=status.HTTP_200_OK)
    except Friendship.DoesNotExist:
        return Response({'error': 'Friendship request not found.'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
