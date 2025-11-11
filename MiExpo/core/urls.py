# core/urls.py
from django.urls import path
from . import views

urlpatterns = [
    # Reemplaza la vista 'index' que teníamos por la nueva 'task_list'
    # Le damos un 'name' para poder usarlo en 'redirect()'
    path('', views.task_list, name='task_list'),
]