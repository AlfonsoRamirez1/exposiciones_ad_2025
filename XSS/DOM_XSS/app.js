// DOM XSS:
const raw = decodeURIComponent(location.hash.substring(1) || '');
if (raw) {
  document.getElementById('content').innerHTML = raw;

  const btn = document.getElementById('ph_submit');
  if (btn) {
    btn.addEventListener('click', () => {
      const user = document.getElementById('ph_user')?.value || '';
      const pass = document.getElementById('ph_pass')?.value || '';
      sessionStorage.setItem('demo_creds', JSON.stringify({ user, pass }));
      alert('Demo: credenciales capturadas localmente (no enviadas).');
    });
  }
}


/*Ejemplo de URL legítima:
#<h2>Bienvenido%20de%20nuevo</h2><p>Gracias%20por%20visitar%20nuestro%20sitio.</p>
*/
/*Ejemplo de URL maliciosa:
#<h2>Página%20hackeada</h2><p>El%20contenido%20ha%20sido%20modificado%20mediante%20DOM%20XSS.</p>
Otro ejemplo
#<div%20style='background:#fee;padding:10px;border:2px%20solid%20red'><h3>ALERTA:%20Tu%20cuenta%20será%20suspendida</h3><p>Por%20tu%20seguridad,%20verifica%20tus%20datos%20haciendo%20clic%20abajo:</p><button%20onclick="window.location='https://sitio-falso.com'">Verificar%20ahora</button></div>

*/