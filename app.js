import { auth } from "./firebase.js";
import { signInWithEmailAndPassword } 
    from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// --- LOGIN ---
const loginForm = document.getElementById("loginForm");

if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Si es admin
                if (email === "admin@americanbestfilling.com") {
                    window.location.href = "admin.html";
                } else {
                    window.location.href = "home.html";
                }
            })
            .catch(() => {
                alert("Correo o contraseña incorrectos");
            });
    });
}
