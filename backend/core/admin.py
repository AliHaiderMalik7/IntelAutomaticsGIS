# Register your models here.
from django.contrib import admin

from .models import Layer


@admin.register(Layer)
class LayerAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'user', 'status', 'type', 'created_at')
    list_filter = ('status', 'type', 'created_at')
    search_fields = ('name', 'user__email')
    ordering = ('-created_at',)
