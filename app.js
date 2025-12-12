const form = document.getElementById("loginForm");

form.addEventListener("submit", function(e) {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    auth.signInWithEmailAndPassword(email, password)
        .then((userCredential) => {

            // Admin
            if (email === "admin@americanbestfilling.com") {
                window.location.href = "admin.html";
            } 
            // Empleado
            else {
                window.location.href = "home.html";
            }
        })
        .catch((error) => {
            alert("Correo o contraseña incorrectos");
            console.error(error);
        });
});
