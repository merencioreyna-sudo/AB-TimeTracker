// components/navbar.js - Barra de navegación dinámica
import { currentUser } from '../app.js';

export async function loadNavbar() {
    const navbarContainer = document.getElementById('navbar-container');
    const user = currentUser || await checkAuthState();
    
    navbarContainer.innerHTML = `
        <nav class="navbar">
            <div class="nav-brand">
                <a href="#/" data-link>
                    <i class="fas fa-clock"></i>
                    <span>AB TimeTracker</span>
                </a>
            </div>
            
            <ul class="nav-menu">
                ${user ? `
                    <li><a href="#/" data-link><i class="fas fa-home"></i> Inicio</a></li>
                    ${user.email === 'admin@example.com' ? 
                        `<li><a href="#/admin" data-link><i class="fas fa-cog"></i> Admin</a></li>` : ''}
                    <li class="user-info">
                        <i class="fas fa-user-circle"></i>
                        <span>${user.email.split('@')[0]}</span>
                    </li>
                    <li>
                        <button class="btn-logout" id="logout-btn">
                            <i class="fas fa-sign-out-alt"></i> Salir
                        </button>
                    </li>
                ` : `
                    <li><a href="#/login" data-link><i class="fas fa-sign-in-alt"></i> Ingresar</a></li>
                `}
            </ul>
            
            <button class="nav-toggle" id="nav-toggle">
                <i class="fas fa-bars"></i>
            </button>
        </nav>
    `;
    
    // Conectar eventos del navbar
    attachNavbarEvents();
}

// Conectar eventos
function attachNavbarEvents() {
    // Botón de logout
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async () => {
            const { signOut } = await import('../supabase.js');
            await signOut();
            window.navigateTo('/login');
        });
    }
    
    // Menú móvil
    const navToggle = document.getElementById('nav-toggle');
    if (navToggle) {
        navToggle.addEventListener('click', () => {
            document.querySelector('.nav-menu').classList.toggle('active');
        });
    }
}

// Verificar estado de autenticación (función auxiliar)
async function checkAuthState() {
    const { getCurrentUser } = await import('../supabase.js');
    return await getCurrentUser();
}