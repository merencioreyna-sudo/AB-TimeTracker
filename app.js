console.log("AB-TimeTracker iniciado");

/* ====== NAVEGACIÓN ====== */
function goAdmin() {
  window.location.href = "admin.html";
}

/* ====== ESTADO DEL EMPLEADO ====== */
function setStatus(status) {
  const dot = document.getElementById("statusDot");
  const text = document.getElementById("statusText");

  if (!dot || !text) return;

  if (status === "online") {
    dot.style.backgroundColor = "lime";
    text.innerText = "En línea";
  }
  if (status === "break") {
    dot.style.backgroundColor = "yellow";
    text.innerText = "En descanso";
  }
  if (status === "offline") {
    dot.style.backgroundColor = "red";
    text.innerText = "Fuera de línea";
  }
}

/* ====== BOTONES DEL EMPLEADO ====== */
function startWork() {
  alert("Jornada iniciada");
  setStatus("online");
}

function startBreak() {
  alert("Descanso iniciado");
  setStatus("break");
}

function resumeWork() {
  alert("Descanso finalizado");
  setStatus("online");
}

function endWork() {
  alert("Jornada finalizada");
  setStatus("offline");
}

/* ====== PANEL ADMIN ====== */
function loadEmployees() {
  const list = document.getElementById("employeeList");
  if (!list) return;

  const fakeEmployees = [
    { name: "Alex", status: "online" },
    { name: "Liz", status: "offline" },
    { name: "Miguel", status: "break" }
  ];

  fakeEmployees.forEach(emp => {
    const div = document.createElement("div");
    div.className = "admin-user-item";

    const dot = document.createElement("span");
    dot.className = "admin-user-dot";

    if (emp.status === "online") dot.style.background = "lime";
    if (emp.status === "offline") dot.style.background = "red";
    if (emp.status === "break") dot.style.background = "yellow";

    div.innerHTML = `<span class='admin-user-name'>${emp.name}</span>`;
    div.appendChild(dot);

    list.appendChild(div);
  });
}

loadEmployees();

function logout() {
  window.location.href = "index.html";
}
