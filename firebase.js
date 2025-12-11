console.log("Firebase conectado (modo demo)");

function login() {
  const email = document.getElementById("email").value;
  const pass = document.getElementById("password").value;

  if (!email || !pass) {
    alert("Ingresa correo y contraseña");
    return;
  }

  alert("Inicio de sesión exitoso");
  window.location.href = "home.html";
}
