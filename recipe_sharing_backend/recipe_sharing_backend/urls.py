from django.contrib import admin
from django.urls import path, include
from recipe.views import create_recipe
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
                  path('admin/', admin.site.urls),
                  path('', include('authentication.urls')),
                  path('recipe/', include('recipe.urls')),
              ] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
