window.globalThis = window;

import { supabase } from "./supabase.js";

/******************************
 * LOGIN
 ******************************/
const loginForm = document.getElementById("loginForm");

if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value.trim();

        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        if (error) {
            alert("Correo o contraseña incorrectos");
            return;
        }

        // Redirigir según si es admin
        if (email === "admin@americanbestfilling.com") {
            window.location.href = "admin.html";
        } else {
            window.location.href = "home.html";
        }
    });
}

/**********************************************
 * CARGAR USUARIO LOGUEADO
 **********************************************/
supabase.auth.onAuthStateChange(async (event, session) => {
    if (session) {
        const email = session.user.email;
        console.log("Usuario autenticado:", email);
    }
});

/**********************************************
 * EMPLEADO: REGISTRO DE HORAS
 **********************************************/
async function registrarAccion(tipo) {
    const { data: sessionData } = await supabase.auth.getSession();
    const email = sessionData.session.user.email;

    await supabase.from("work_logs").insert({
        employee_email: email,
        action: tipo
    });

    alert("Marcado correctamente: " + tipo);
}

// Botones
window.marcarEntrada = () => registrarAccion("entrada");
window.marcarDescanso = () => registrarAccion("descanso");
window.marcarRegreso = () => registrarAccion("regreso");
window.marcarSalida = () => registrarAccion("salida");

/**********************************************
 * ADMIN: VER EMPLEADOS
 **********************************************/
async function cargarEmpleados() {
    const lista = document.getElementById("employeeList");
    if (!lista) return;

    const { data, error } = await supabase.from("employees").select("*");

    lista.innerHTML = "";

    data.forEach(emp => {
        lista.innerHTML += `
            <div class="employee-card">
                <strong>${emp.email}</strong><br>
                Estado: ${emp.status}<br>
                <button onclick="verHistorial('${emp.email}')">Ver historial</button>
            </div>
        `;
    });
}

window.verHistorial = async function(email) {
    const cont = document.getElementById("adminHistory");

    const { data } = await supabase
        .from("work_logs")
        .select("*")
        .eq("employee_email", email);

    cont.innerHTML = `<h3>Historial de ${email}</h3>`;

    data.forEach(r => {
        cont.innerHTML += `
            <div class="history-item">
                Acción: ${r.action}<br>
                Hora: ${r.action_time}
            </div>
        `;
    });
};

// Auto cargar si es admin
if (window.location.pathname.includes("admin.html")) {
    cargarEmpleados();
}

// ================================
// MOSTRAR EMAIL DEL USUARIO EN SIDEBAR
// ================================
auth.onAuthStateChanged(user => {
    if (user) {
        const emailElement = document.getElementById("userEmail");
        if (emailElement) {
            emailElement.textContent = user.email;
        }
    }
});

// ================================
// LOGOUT
// ================================
export function logout() {
    auth.signOut()
        .then(() => {
            console.log("Sesión cerrada correctamente");
            window.location.href = "index.html";
        })
        .catch((error) => {
            console.error("Error cerrando sesión:", error);
            alert("No se pudo cerrar sesión.");
        });
}

// NECESARIO para que funcione desde el HTML
window.logout = logout;

