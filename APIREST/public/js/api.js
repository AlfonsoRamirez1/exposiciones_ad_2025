const apiUrl = 'http://localhost:3000/usuarios';

    const form = document.getElementById('userForm');
    const userIdInput = document.getElementById('userId');
    const nombreInput = document.getElementById('nombre');
    const correoInput = document.getElementById('correo');
    const tableBody = document.getElementById('userTableBody');
    const loadUsersBtn = document.getElementById('loadUsers');

    // Cargar usuarios
    async function cargarUsuarios() {
      const res = await fetch(apiUrl);
      const usuarios = await res.json();

      tableBody.innerHTML = '';
      usuarios.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${user.id}</td>
          <td>${user.nombre}</td>
          <td>${user.correo}</td>
          <td>
            <button onclick="editarUsuario(${user.id}, '${user.nombre}', '${user.correo}')">✏️</button>
            <button onclick="eliminarUsuario(${user.id})">🗑️</button>
          </td>
        `;
        tableBody.appendChild(row);
      });
    }

    // Agregar / Editar usuario
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const userData = {
        nombre: nombreInput.value,
        correo: correoInput.value
      };

      if (userIdInput.value) {
        // PUT → Actualizar
        await fetch(`${apiUrl}/${userIdInput.value}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(userData)
        });
        alert('Usuario actualizado');
      } else {
        // POST → Crear
        await fetch(apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(userData)
        });
        alert('Usuario agregado');
      }

      form.reset();
      cargarUsuarios();
    });

    // Editar usuario
    function editarUsuario(id, nombre, correo) {
      userIdInput.value = id;
      nombreInput.value = nombre;
      correoInput.value = correo;
    }

    // Eliminar usuario
    async function eliminarUsuario(id) {
      if (confirm('Deseas eliminar este usuario?')) {
        await fetch(`${apiUrl}/${id}`, { method: 'DELETE' });
        alert('Usuario eliminado');
        cargarUsuarios();
      }
    }

    // Boton para recargar usuarios
    loadUsersBtn.addEventListener('click', cargarUsuarios);

    // Carga inicial
    cargarUsuarios();