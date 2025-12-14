// app.js - Router y gestión de estado global
import { renderHome } from './views/home.js';
import { renderAdmin } from './views/admin.js';
import { renderAuth } from './views/auth.js';
import { checkAuthState } from './supabase.js';

// Estado global de la aplicación
export let currentUser = null;
export let currentView = '';

// Configuración de rutas
const routes = {
    '/': {
        title: 'Inicio - AB TimeTracker',
        view: renderHome,
        requiresAuth: true
    },
    '/login': {
        title: 'Iniciar Sesión',
        view: renderAuth,
        requiresAuth: false
    },
    '/admin': {
        title: 'Panel de Administración',
        view: renderAdmin,
        requiresAuth: true,
        requiresAdmin: true
    }
};

// Router principal
export async function navigateTo(path) {
    // Validar y normalizar ruta
    if (!path.startsWith('/')) path = '/' + path;
    
    // Actualizar URL sin recargar
    window.history.pushState({}, '', window.BASE_PATH + '#' + path);
    
    // Cargar la vista
    await loadView(path);
}

// Cargar vista
async function loadView(path) {
    const route = routes[path] || routes['/'];
    const contentEl = document.getElementById('content');
    
    // Verificar autenticación
    const authState = await checkAuthState();
    currentUser = authState.user;
    
    // Redirigir si necesita autenticación
    if (route.requiresAuth && !currentUser) {
        return navigateTo('/login');
    }
    
    // Redirigir si necesita admin
    if (route.requiresAdmin && currentUser?.email !== 'admin@example.com') {
        alert('Acceso no autorizado. Solo administradores.');
        return navigateTo('/');
    }
    
    // Mostrar loading
    contentEl.innerHTML = `
        <div class="loading-spinner">
            <i class="fas fa-spinner fa-spin"></i>
        </div>
    `;
    
    try {
        // Renderizar vista
        const viewHTML = await route.view();
        contentEl.innerHTML = viewHTML;
        currentView = path;
        
        // Actualizar título
        document.title = route.title;
        
        // Conectar eventos dinámicos
        attachViewEvents(path);
        
    } catch (error) {
        console.error('Error cargando vista:', error);
        contentEl.innerHTML = `
            <div class="error-container">
                <i class="fas fa-exclamation-triangle"></i>
                <h2>Error cargando la página</h2>
                <p>${error.message}</p>
                <button onclick="location.reload()">Recargar</button>
            </div>
        `;
    }
}

// Conectar eventos específicos de cada vista
function attachViewEvents(view) {
    switch(view) {
        case '/':
            attachHomeEvents();
            break;
        case '/login':
            attachAuthEvents();
            break;
        case '/admin':
            attachAdminEvents();
            break;
    }
}

// Eventos para Home
function attachHomeEvents() {

    console.log('=== DEBUG: Conectando eventos del home ===');
    console.log('Usuario actual:', currentUser);
    
    const checkInBtn = document.getElementById('check-in-btn');
    console.log('Botón de entrada encontrado:', !!checkInBtn);
    
    if (checkInBtn) {
        checkInBtn.addEventListener('click', () => {
            console.log('=== CLICK EN REGISTRAR ENTRADA ===');
            console.log('Usuario ID:', currentUser?.id);
            console.log('Hora actual:', new Date().toISOString());
        });
    }
    // Botón de registro de tiempo
    const timeBtn = document.getElementById('register-time');
    if (timeBtn) {
        timeBtn.addEventListener('click', () => {
            document.getElementById('time-modal').style.display = 'block';
        });
    }
    
    // Cerrar modal
    const closeModal = document.querySelector('.close-modal');
    if (closeModal) {
        closeModal.addEventListener('click', () => {
            document.getElementById('time-modal').style.display = 'none';
        });
    }
}

// Eventos para Auth
function attachAuthEvents() {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;
            
            // Importar aquí para evitar dependencia circular
            const { signIn } = await import('./supabase.js');
            await signIn(email, password);
        });
    }
    
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('register-email').value;
            const password = document.getElementById('register-password').value;
            
            const { signUp } = await import('./supabase.js');
            await signUp(email, password);
        });
    }
}

// Eventos para Admin
function attachAdminEvents() {
    // Cargar reportes
    setTimeout(() => {
        loadAdminReports();
    }, 500);
}

// Cargar reportes de admin
async function loadAdminReports() {
    try {
        const { getTimeRecords } = await import('./supabase.js');
        const records = await getTimeRecords();
        
        const tableBody = document.getElementById('records-table-body');
        if (tableBody && records) {
            tableBody.innerHTML = records.map(record => `
                <tr>
                    <td>${record.user_email}</td>
                    <td>${new Date(record.check_in).toLocaleString()}</td>
                    <td>${record.check_out ? new Date(record.check_out).toLocaleString() : 'En curso'}</td>
                    <td>${record.total_hours || '--'}</td>
                    <td><span class="status-badge ${record.status}">${record.status}</span></td>
                </tr>
            `).join('');
        }
    } catch (error) {
        console.error('Error cargando reportes:', error);
    }
}

// Manejar navegación con botones de atrás/adelante
window.addEventListener('popstate', () => {
    const path = window.location.hash.replace('#', '') || '/';
    loadView(path);
});

// Inicializar router
export function initRouter() {
    // Cargar vista inicial basada en hash
    const initialPath = window.location.hash.replace('#', '') || '/';
    loadView(initialPath);
    
    // Interceptar clicks en enlaces
    document.addEventListener('click', (e) => {
        const link = e.target.closest('a[data-link]');
        if (link) {
            e.preventDefault();
            const path = link.getAttribute('href');
            navigateTo(path);
        }
    });
}

// Exportar función de navegación globalmente
window.navigateTo = navigateTo;