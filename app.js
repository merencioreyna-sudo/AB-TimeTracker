/********************************
 * IMPORTS FIREBASE MODULAR
 ********************************/
import { auth, db } from "./firebase-config.js";
import { 
    signInWithEmailAndPassword,
    onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

import { 
    doc, setDoc, getDoc, 
    collection, getDocs 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

/********************************
 * LOGIN
 ********************************/
const loginForm = document.getElementById("loginForm");

if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value.trim();

        try {
            await signInWithEmailAndPassword(auth, email, password);

            // Guardar estado online
            await setDoc(doc(db, "users", email), {
                email: email,
                estado: "online"
            }, { merge: true });

            if (email === "admin@americanbestfilling.com") {
                window.location.href = "admin.html";
            } else {
                window.location.href = "home.html";
            }

        } catch (error) {
            alert("Correo o contraseña incorrectos");
            console.error(error);
        }
    });
}

/********************************
 * DETECTAR USUARIO LOGUEADO
 ********************************/
onAuthStateChanged(auth, async (user) => {
    if (!user) return;

    const email = user.email;
    if (document.getElementById("statusLabel")) {
        document.getElementById("statusLabel").textContent = "En línea";
    }

    cargarHistorialEmpleado(email);
});

/********************************
 * UTILIDADES
 ********************************/
function obtenerFecha() {
    const f = new Date();
    return `${f.getFullYear()}-${(f.getMonth()+1)
        .toString().padStart(2, '0')}-${f.getDate()
        .toString().padStart(2, '0')}`;
}

/********************************
 * GUARDAR ACCIÓN (ENTRADA ETC.)
 ********************************/
async function guardarAccion(tipo) {
    const user = auth.currentUser;
    if (!user) return;

    const email = user.email;
    const fecha = obtenerFecha();
    const hora = new Date().toLocaleTimeString();

    await setDoc(doc(db, "registros", email, "dias", fecha), {
        [tipo]: hora
    }, { merge: true });

    cargarHistorialEmpleado(email);
}

/* Botones empleado */
window.marcarEntrada = () => guardarAccion("entrada");
window.marcarDescanso = () => guardarAccion("descanso");
window.marcarRegreso  = () => guardarAccion("regreso");
window.marcarSalida   = () => guardarAccion("salida");

/********************************
 * HISTORIAL EMPLEADO
 ********************************/
async function cargarHistorialEmpleado(email) {
    const contenedor = document.getElementById("historyList");
    if (!contenedor) return;

    const diasSnap = await getDocs(collection(db, "registros", email, "dias"));

    contenedor.innerHTML = "";

    diasSnap.forEach((docu) => {
        const data = docu.data();
        contenedor.innerHTML += `
            <div class="history-item">
                <strong>${docu.id}</strong><br>
                Entrada: ${data.entrada || "-"}<br>
                Descanso: ${data.descanso || "-"}<br>
                Regreso: ${data.regreso || "-"}<br>
                Salida: ${data.salida || "-"}
            </div>
        `;
    });
}

/********************************
 * ADMIN - CARGAR EMPLEADOS
 ********************************/
async function cargarEmpleadosAdmin() {
    const lista = document.getElementById("employeeList");
    if (!lista) return;

    const usersSnap = await getDocs(collection(db, "users"));

    lista.innerHTML = "";

    usersSnap.forEach((docu) => {
        const data = docu.data();
        lista.innerHTML += `
            <div class="employee-card">
                <strong>${data.email}</strong><br>
                Estado: ${data.estado || "offline"}<br><br>
                <button class="btn-action" onclick="verHistorialAdmin('${data.email}')">
                    Ver historial
                </button>
            </div>
        `;
    });
}

/********************************
 * ADMIN - VER HISTORIAL
 ********************************/
async function verHistorialAdmin(email) {
    const contenedor = document.getElementById("adminHistory");
    contenedor.innerHTML = `<h3>Cargando historial de ${email}...</h3>`;

    const diasSnap = await getDocs(collection(db, "registros", email, "dias"));

    contenedor.innerHTML = `<h3>${email}</h3>`;

    diasSnap.forEach((docu) => {
        const data = docu.data();
        contenedor.innerHTML += `
            <div class="history-item">
                <strong>${docu.id}</strong><br>
                Entrada: ${data.entrada || "-"}<br>
                Descanso: ${data.descanso || "-"}<br>
                Regreso: ${data.regreso || "-"}<br>
                Salida: ${data.salida || "-"}
            </div>
        `;
    });
}

window.verHistorialAdmin = verHistorialAdmin;

/********************************
 * AUTOEJECUCIÓN ADMIN
 ********************************/
if (window.location.pathname.includes("admin.html")) {
    onAuthStateChanged(auth, (user) => {
        if (user) cargarEmpleadosAdmin();
    });
}
