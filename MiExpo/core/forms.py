# core/forms.py (¡Archivo nuevo!)
from django import forms
from .models import Task

class TaskForm(forms.ModelForm):
    class Meta:
        model = Task
        # Define qué campos del modelo se usarán en el formulario
        fields = ['title', 'description']
        # (Dejamos 'completed' y 'created_at' fuera a propósito)