# core/admin.py
from django.contrib import admin
from .models import Task

# Registra el modelo Task para que aparezca en el admin
@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    list_display = ('title', 'completed', 'created_at')
    list_filter = ('completed', 'created_at')
    search_fields = ('title', 'description')
