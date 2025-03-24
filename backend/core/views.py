from rest_framework import generics
from rest_framework.permissions import IsAuthenticated

from .models import Layer
from .serializers import LayerSerializer


class UserRasterLayerListView(generics.ListAPIView):
    """
    API to get a list of raster layers attached to the logged-in user.
    """
    serializer_class = LayerSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Layer.objects.filter(user=self.request.user)
