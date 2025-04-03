# account/serializers.py

from rest_framework import serializers
from django.contrib.auth import get_user_model

from core.serializers import LayerSerializer

User = get_user_model()

class ProfileSerializer(serializers.ModelSerializer):
    layers = LayerSerializer(many=True)
    class Meta:
        model = User
        fields = ['id', 'email', 'first_name', 'last_name', 'center_lat', 'center_long', 'is_superuser', 'layers']
