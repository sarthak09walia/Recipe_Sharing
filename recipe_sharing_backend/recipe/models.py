from django.db import models
from authentication.models import UserAccount


class Recipe(models.Model):
    date_time_added = models.DateTimeField(auto_now_add=True)
    user = models.ForeignKey(UserAccount, on_delete=models.CASCADE)
    name = models.CharField(max_length=200)
    image = models.ImageField(upload_to='uploads/')
    ingredients = models.JSONField()
    steps = models.JSONField()
    description = models.CharField(max_length=150)

    class Meta:
        ordering = ['-date_time_added']


class Comment(models.Model):
    recipe = models.ForeignKey(Recipe, on_delete=models.CASCADE, related_name='comments')
    user = models.ForeignKey(UserAccount, on_delete=models.CASCADE)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)


class Like(models.Model):
    recipe = models.ForeignKey(Recipe, on_delete=models.CASCADE, related_name='likes')
    user = models.ForeignKey(UserAccount, on_delete=models.CASCADE)
