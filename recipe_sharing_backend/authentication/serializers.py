from djoser.serializers import UserCreateSerializer
from django.contrib.auth import get_user_model
from rest_framework import serializers
from .models import Friendship

User = get_user_model()


class CreateUserSerializer(UserCreateSerializer):
    # thumbnail = serializers.ImageField()

    class Meta(UserCreateSerializer.Meta):
        model = User
        fields = ['email', 'name', 'is_staff', 'image']


class FriendshipSerializer(serializers.ModelSerializer):
    class Meta:
        model = Friendship
        fields = '__all__'


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'name', 'image']
