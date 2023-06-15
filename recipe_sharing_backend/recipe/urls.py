from django.urls import path, include
from .views import create_recipe, delete_recipe, display_all, edit_recipe, get_user_recipes, create_comment, \
    get_comments, delete_comment, toggle_like, get_liked_recipes, get_specific_recipe

urlpatterns = [
    path('add-recipe/', create_recipe),
    path('delete-recipe/<int:recipe_id>', delete_recipe),
    path('get-all/', display_all),
    path('update-recipe/', edit_recipe),
    path('user-recipes/', get_user_recipes),
    path('create-comment/', create_comment),
    path('get-comments/', get_comments),
    path('delete-comment/', delete_comment),
    path('toggle-like/', toggle_like),
    path('get-liked/', get_liked_recipes, name='get_liked_recipes'),
    path('get-specific-recipe/<int:recipe_id>', get_specific_recipe, name='get_liked_recipes'),
]
