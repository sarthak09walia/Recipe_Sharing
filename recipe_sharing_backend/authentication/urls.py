from django.urls import path, include
from .views import update_image, search_user, create_friend_request, get_user_send_requests, get_user_friends, \
    accept_friendship_request, specific_user_details

urlpatterns = [
    path('authentication/', include('djoser.urls')),
    path('authentication/', include('djoser.urls.jwt')),
    path('update-image/<str:email>/', update_image, name='update_image'),
    path('search-user/<str:query>/', search_user),
    path('create-friend-request/', create_friend_request),
    path('get-user-send-requests/', get_user_send_requests),
    path('get-user-friends/', get_user_friends),
    path('accept-friendship-request/', accept_friendship_request),
    path('specific-user-details/<int:user_id>/', specific_user_details)
]
