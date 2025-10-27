document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('form-comentario');
    const inputComentario = document.getElementById('texto-comentario');
    const divComentarios = document.getElementById('comentarios');

    function guardarComentario(texto) {
        const comentarios = JSON.parse(localStorage.getItem('comentarios_db')) || [];
        comentarios.push({ texto: texto });
        localStorage.setItem('comentarios_db', JSON.stringify(comentarios));
    }

    
    // VULNERABLE: renderiza con innerHTML -> Stored XSS
    function cargarComentarios() {
        const comentarios = JSON.parse(localStorage.getItem('comentarios_db')) || [];
        divComentarios.innerHTML = '';
        for (const c of comentarios) {
        const comentarioHTML = `<div class="comentario">${c.texto}</div>`;
        divComentarios.innerHTML += comentarioHTML;
        }
    }

       /*
    //Funcion segura para la carga de comentarios
    //Se renderiza con textContent -> Evita Stored XSS
    
    function cargarComentarios() {
        const comentarios = JSON.parse(localStorage.getItem('comentarios_db')) || [];
        divComentarios.innerHTML = '';

        for (const c of comentarios) {
        const divElemento = document.createElement('div');
        divElemento.className = 'comentario';
            // Se usa textContent
        divElemento.textContent = c.texto;
        // Se agrega el elemento
        divComentarios.appendChild(divElemento);
        }
    }
    */
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        guardarComentario(inputComentario.value);
        cargarComentarios();
        form.reset();
    });

    // Botón para limpiar los comentarios almacenados
    document.getElementById('btn-limpiar').addEventListener('click', () => {
        localStorage.removeItem('comentarios_db');
        location.reload();
    });
    cargarComentarios();
});


/*
<img src=x onerror="var e=document.getElementById('enlace-descarga'); e.href='DOCUMENTO_FALSO'; e.innerText='¡Descargar (VERSIÓN CORRUPTA)!'; e.style.background='red'">
*/