from django.urls import path

from .views import UserRasterLayerListView


urlpatterns = [
    path('user-layers/', UserRasterLayerListView.as_view(), name='user-layers'),
]
