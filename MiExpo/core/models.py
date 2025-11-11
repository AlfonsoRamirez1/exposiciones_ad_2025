# core/models.py
from django.db import models

class Task(models.Model):
    title = models.CharField(max_length=200, verbose_name="Título")
    description = models.TextField(blank=True, null=True, verbose_name="Descripción")
    completed = models.BooleanField(default=False, verbose_name="Completada")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Fecha de creación")

    def __str__(self):
        # Esto es lo que se mostrará en el panel de admin
        return self.title

    class Meta:
        # Ordena las tareas: las no completadas primero, luego por fecha de creación+
        ordering = ['completed', 'created_at']