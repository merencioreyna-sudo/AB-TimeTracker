/******************************
 * LOGIN
 ******************************/
const loginForm = document.getElementById("loginForm");
if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value.trim();

        try {
            await auth.signInWithEmailAndPassword(email, password);

            // Guardar estado online
            await db.collection("users").doc(email).set({
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

/******************************
 * REGISTRO DE HORAS - EMPLEADO
 ******************************/
const user = auth.currentUser;
auth.onAuthStateChanged(async (user) => {
    if (!user) return;

    const email = user.email;
    const hoy = obtenerFecha();

    if (document.body.contains(document.getElementById("statusLabel"))) {
        document.getElementById("statusLabel").innerText = "En línea";
    }

    cargarHistorialEmpleado(email);
});

/* Obtener fecha YYYY-MM-DD */
function obtenerFecha() {
    const f = new Date();
    return `${f.getFullYear()}-${(f.getMonth()+1).toString().padStart(2,'0')}-${f.getDate().toString().padStart(2,'0')}`;
}

/* Guardar acción */
async function guardarAccion(tipo) {
    const user = auth.currentUser;
    if (!user) return;

    const email = user.email;
    const fecha = obtenerFecha();
    const hora = new Date().toLocaleTimeString();

    await db.collection("registros")
        .doc(email)
        .collection("dias")
        .doc(fecha)
        .set({
            [tipo]: hora
        }, { merge: true });

    cargarHistorialEmpleado(email);
}

/* Botones del empleado */
function marcarEntrada() { guardarAccion("entrada"); }
function marcarDescanso() { guardarAccion("descanso"); }
function marcarRegreso() { guardarAccion("regreso"); }
function marcarSalida() { guardarAccion("salida"); }

/******************************
 * HISTORIAL DEL EMPLEADO
 ******************************/
async function cargarHistorialEmpleado(email) {
    const contenedor = document.getElementById("historyList");
    if (!contenedor) return;

    const dias = await db.collection("registros")
        .doc(email)
        .collection("dias")
        .get();

    contenedor.innerHTML = "";

    dias.forEach(doc => {
        const data = doc.data();
        contenedor.innerHTML += `
            <div class="history-item">
                <strong>${doc.id}</strong><br>
                Entrada: ${data.entrada || "-"}<br>
                Descanso: ${data.descanso || "-"}<br>
                Regreso: ${data.regreso || "-"}<br>
                Salida: ${data.salida || "-"}
            </div>
        `;
    });
}

/******************************
 * ADMIN - CARGAR EMPLEADOS
 ******************************/
async function cargarEmpleadosAdmin() {
    const lista = document.getElementById("employeeList");
    if (!lista) return;

    const empleados = await db.collection("users").get();

    lista.innerHTML = "";

    empleados.forEach(doc => {
        const data = doc.data();
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

/******************************
 * ADMIN - VER HISTORIAL POR EMPLEADO
 ******************************/
async function verHistorialAdmin(email) {
    const contenedor = document.getElementById("adminHistory");
    contenedor.innerHTML = `<h3>Cargando historial de ${email}...</h3>`;

    const dias = await db.collection("registros")
        .doc(email)
        .collection("dias")
        .get();

    contenedor.innerHTML = `<h3>${email}</h3>`;

    dias.forEach(doc => {
        const data = doc.data();
        contenedor.innerHTML += `
            <div class="history-item">
                <strong>${doc.id}</strong><br>
                Entrada: ${data.entrada || "-"}<br>
                Descanso: ${data.descanso || "-"}<br>
                Regreso: ${data.regreso || "-"}<br>
                Salida: ${data.salida || "-"}
            </div>
        `;
    });
}

/******************************
 * AUTO EJECUCIÓN PARA ADMIN
 ******************************/
if (window.location.pathname.includes("admin.html")) {
    auth.onAuthStateChanged((u) => {
        if (u) cargarEmpleadosAdmin();
    });
}
