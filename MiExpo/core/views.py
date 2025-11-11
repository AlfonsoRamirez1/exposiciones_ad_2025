# core/views.py
from django.shortcuts import render, redirect
from .models import Task
from .forms import TaskForm


def task_list(request):
    # Lógica para manejar la creación de una nueva tarea (POST)
    if request.method == 'POST':
        form = TaskForm(request.POST)
        if form.is_valid():
            form.save()  # Guarda la nueva tarea en la base de datos
            return redirect('task_list')  # Redirige a la misma página (para limpiar el form)

    # Lógica para mostrar la página (GET)
    form = TaskForm()  # Un formulario vacío para "Añadir Tarea"
    tasks = Task.objects.all()  # Obtiene todas las tareas de la BD

    # Renderiza la plantilla HTML, pasándole los datos
    context = {
        'tasks': tasks,
        'form': form,
    }
    return render(request, 'core/task_list.html', context)