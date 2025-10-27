// REFLECTED XSS: toma el parámetro ?notice=
const params = new URLSearchParams(location.search);
const raw = params.get('notice') || '';

if (raw) {
  const modal = document.createElement('div');
  modal.className = 'modal';
  // Vulnerable
  modal.innerHTML = `
    <div class="card">
      <h3>Aviso del Sitio</h3>
      <div id="payload">${raw}</div>
      <button id="close">Cerrar</button>
    </div>`;
  document.body.appendChild(modal);
  document.getElementById('close').onclick = () => modal.remove();
}


/*Ejemplo de URL legítima:
?notice=<h3>Sesión%20Expirada</h3><p>Por%20favor%20ingrese%20de%20nuevo%20sus%20credenciales.</p>
*/
/*Ejemplo de URL maliciosa:
?notice=<h3>Sesión%20Expirada</h3><p>Ingrese%20de%20nuevo%20sus%20credenciales.</p><input%20placeholder='Usuario'><br><input%20type='password'>
?notice=<style>body{background:black;color:red}</style><h3>Página%20en%20mantenimiento</h3>
*/