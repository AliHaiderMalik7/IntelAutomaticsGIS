from django.db import models
from django.contrib.auth import get_user_model


User = get_user_model()

# Create your models here.
class Layer(models.Model):
    class StatusChoices(models.TextChoices):
        ACTIVE = 'active', 'Active'
        INACTIVE = 'inactive', 'Inactive'
    class Type(models.TextChoices):
        VECTOR = 'vector'
        RASTER = 'raster'

    """
    Model to handle raster layers for Database.
    """
    name = models.CharField(max_length=255)
    geoserver_link = models.CharField(max_length=255)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='layers')
    status = models.CharField(max_length=25, choices=StatusChoices.choices, default=StatusChoices.ACTIVE)
    type = models.CharField(max_length=50, choices=Type.choices, default=Type.RASTER)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Layer: {self.name} - {self.type}"
