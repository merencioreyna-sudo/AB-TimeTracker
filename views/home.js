// views/home.js - Actualizado
import { currentUser } from '../app.js';
import { registerCheckIn, registerCheckOut, getTodayRecord, getUserRecords } from '../supabase.js';

export async function renderHome() {
    const user = currentUser;
    if (!user) {
        return `
            <div class="error-container">
                <h2>No estás autenticado</h2>
                <p>Por favor, <a href="#/login" data-link>inicia sesión</a> para continuar.</p>
            </div>
        `;
    }
    
    let todayRecord = null;
    try {
        todayRecord = await getTodayRecord(user.id);
    } catch (error) {
        console.error('Error obteniendo registro de hoy:', error);
    }
    
    return `
        <div class="dashboard">
            <div class="welcome-card">
                <h1><i class="fas fa-user-clock"></i> Bienvenido, ${user.email.split('@')[0]}</h1>
                <p id="current-time">${new Date().toLocaleDateString('es-ES', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                })}</p>
            </div>
            
            <div class="time-cards">
                <!-- Tarjeta de ENTRADA -->
                <div class="time-card ${todayRecord?.check_in ? 'active' : ''}">
                    <h3><i class="fas fa-sign-in-alt"></i> Entrada</h3>
                    <p class="time-display" id="check-in-time">
                        ${todayRecord?.check_in ? 
                            new Date(todayRecord.check_in).toLocaleTimeString('es-ES', { 
                                hour: '2-digit', 
                                minute: '2-digit' 
                            }) : 
                            '--:--'}
                    </p>
                    ${!todayRecord?.check_in ? `
                        <button class="btn-primary" id="check-in-btn">
                            <i class="fas fa-fingerprint"></i> Registrar Entrada
                        </button>
                        <p class="time-hint">Haz clic cuando comiences tu jornada</p>
                    ` : `
                        <p class="time-status success">
                            <i class="fas fa-check-circle"></i> Registrada
                        </p>
                    `}
                </div>
                
                <!-- Tarjeta de SALIDA -->
                <div class="time-card ${todayRecord?.check_out ? 'active' : ''}">
                    <h3><i class="fas fa-sign-out-alt"></i> Salida</h3>
                    <p class="time-display" id="check-out-time">
                        ${todayRecord?.check_out ? 
                            new Date(todayRecord.check_out).toLocaleTimeString('es-ES', { 
                                hour: '2-digit', 
                                minute: '2-digit' 
                            }) : 
                            '--:--'}
                    </p>
                    ${todayRecord?.check_in && !todayRecord?.check_out ? `
                        <button class="btn-secondary" id="check-out-btn">
                            <i class="fas fa-fingerprint"></i> Registrar Salida
                        </button>
                        <p class="time-hint">Haz clic cuando termines tu jornada</p>
                    ` : todayRecord?.check_out ? `
                        <p class="time-status success">
                            <i class="fas fa-check-circle"></i> Registrada
                        </p>
                    ` : `
                        <p class="time-status waiting">
                            <i class="fas fa-clock"></i> Esperando entrada
                        </p>
                    `}
                </div>
                
                <!-- Tarjeta de HORAS -->
                <div class="time-card ${todayRecord?.total_hours ? 'active' : ''}">
                    <h3><i class="fas fa-clock"></i> Horas Totales</h3>
                    <p class="hours-display" id="total-hours">${todayRecord?.total_hours || '0.0'}</p>
                    <p class="hours-label">horas trabajadas</p>
                    ${todayRecord?.status === 'active' ? `
                        <div class="timer-active">
                            <i class="fas fa-play-circle"></i>
                            <span id="live-timer">Jornada en curso...</span>
                        </div>
                    ` : ''}
                </div>
            </div>
            
            <!-- Panel de actividad reciente -->
            <div class="recent-activity">
                <h2><i class="fas fa-history"></i> Tus Registros de Hoy</h2>
                <div class="activity-actions">
                    <button class="btn-small" id="refresh-activity">
                        <i class="fas fa-sync-alt"></i> Actualizar
                    </button>
                </div>
                <div id="activity-list" class="activity-list">
                    <div class="loading-activity">
                        <i class="fas fa-spinner fa-spin"></i> Cargando actividad...
                    </div>
                </div>
            </div>
            
            <!-- Modal de confirmación -->
            <div id="confirm-modal" class="modal">
                <div class="modal-content">
                    <span class="close-modal">&times;</span>
                    <h3><i class="fas fa-check-circle"></i> Confirmar Registro</h3>
                    <p id="modal-message">¿Estás seguro de registrar tu entrada?</p>
                    <div class="modal-buttons">
                        <button class="btn-secondary" id="modal-cancel">Cancelar</button>
                        <button class="btn-primary" id="modal-confirm">Confirmar</button>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Script para actualizar hora actual -->
        <script>
            // Actualizar hora actual cada segundo
            function updateCurrentTime() {
                const now = new Date();
                const timeElement = document.getElementById('current-time');
                if (timeElement) {
                    timeElement.textContent = now.toLocaleDateString('es-ES', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit'
                    });
                }
                
                // Actualizar timer en vivo si hay jornada activa
                const liveTimer = document.getElementById('live-timer');
                if (liveTimer && ${todayRecord?.status === 'active'}) {
                    const checkInTime = new Date('${todayRecord?.check_in || ''}');
                    const diffMs = now - checkInTime;
                    const diffHours = (diffMs / (1000 * 60 * 60)).toFixed(2);
                    liveTimer.textContent = \`\${diffHours} horas transcurridas\`;
                }
            }
            
            // Iniciar actualización de tiempo
            setInterval(updateCurrentTime, 1000);
            updateCurrentTime();
        </script>
    `;
}

// Función para conectar eventos
export function attachHomeEvents() {
    console.log('Conectando eventos del home...');
    
    // Botón de REGISTRAR ENTRADA
    const checkInBtn = document.getElementById('check-in-btn');
    if (checkInBtn) {
        console.log('Botón de entrada encontrado');
        checkInBtn.addEventListener('click', handleCheckIn);
    }
    
    // Botón de REGISTRAR SALIDA
    const checkOutBtn = document.getElementById('check-out-btn');
    if (checkOutBtn) {
        checkOutBtn.addEventListener('click', handleCheckOut);
    }
    
    // Botón de REFRESH
    const refreshBtn = document.getElementById('refresh-activity');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', loadRecentActivity);
    }
    
    // Modal de confirmación
    const modal = document.getElementById('confirm-modal');
    const closeModal = document.querySelector('.close-modal');
    const modalCancel = document.getElementById('modal-cancel');
    
    if (closeModal) {
        closeModal.addEventListener('click', () => {
            modal.style.display = 'none';
        });
    }
    
    if (modalCancel) {
        modalCancel.addEventListener('click', () => {
            modal.style.display = 'none';
        });
    }
    
    // Cerrar modal al hacer clic fuera
    window.addEventListener('click', (e) => {
        if (modal && e.target === modal) {
            modal.style.display = 'none';
        }
    });
    
    // Cargar actividad inicial
    loadRecentActivity();
}

// ===== MANEJADORES DE EVENTOS =====

// Manejar registro de ENTRADA
async function handleCheckIn() {
    console.log('Manejando registro de entrada...');
    const modal = document.getElementById('confirm-modal');
    const modalMessage = document.getElementById('modal-message');
    const modalConfirm = document.getElementById('modal-confirm');
    
    if (!modal || !modalMessage || !modalConfirm) {
        alert('Error: No se pudo mostrar la confirmación');
        return;
    }
    
    // Configurar modal
    modalMessage.textContent = '¿Estás seguro de registrar tu ENTRADA ahora?';
    modal.style.display = 'block';
    
    // Remover eventos previos
    const newConfirm = modalConfirm.cloneNode(true);
    modalConfirm.parentNode.replaceChild(newConfirm, modalConfirm);
    
    // Agregar nuevo evento
    newConfirm.addEventListener('click', async () => {
        try {
            console.log('Confirmando registro de entrada...');
            newConfirm.disabled = true;
            newConfirm.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Procesando...';
            
            const { currentUser } = await import('../app.js');
            const { registerCheckIn } = await import('../supabase.js');
            
            if (!currentUser || !currentUser.id) {
                throw new Error('Usuario no autenticado');
            }
            
            console.log('Usuario ID:', currentUser.id);
            const success = await registerCheckIn(currentUser.id);
            
            if (success) {
                // Cerrar modal
                modal.style.display = 'none';
                
                // Mostrar notificación
                showNotification('¡Entrada registrada correctamente!', 'success');
                
                // Recargar la vista después de 1 segundo
                setTimeout(() => {
                    window.navigateTo('/');
                }, 1000);
            } else {
                throw new Error('No se pudo registrar la entrada');
            }
            
        } catch (error) {
            console.error('Error en registro de entrada:', error);
            showNotification('Error: ' + error.message, 'error');
            modal.style.display = 'none';
        }
    });
}

// Manejar registro de SALIDA
async function handleCheckOut() {
    const modal = document.getElementById('confirm-modal');
    const modalMessage = document.getElementById('modal-message');
    const modalConfirm = document.getElementById('modal-confirm');
    
    modalMessage.textContent = '¿Estás seguro de registrar tu SALIDA ahora?';
    modal.style.display = 'block';
    
    // Remover eventos previos y agregar nuevo
    const newConfirm = modalConfirm.cloneNode(true);
    modalConfirm.parentNode.replaceChild(newConfirm, modalConfirm);
    
    newConfirm.addEventListener('click', async () => {
        try {
            newConfirm.disabled = true;
            newConfirm.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Procesando...';
            
            const { currentUser } = await import('../app.js');
            const { registerCheckOut } = await import('../supabase.js');
            
            if (!currentUser || !currentUser.id) {
                throw new Error('Usuario no autenticado');
            }
            
            const success = await registerCheckOut(currentUser.id);
            
            if (success) {
                modal.style.display = 'none';
                showNotification('¡Salida registrada correctamente!', 'success');
                
                setTimeout(() => {
                    window.navigateTo('/');
                }, 1000);
            }
            
        } catch (error) {
            console.error('Error en registro de salida:', error);
            showNotification('Error: ' + error.message, 'error');
            modal.style.display = 'none';
        }
    });
}

// ===== FUNCIONES AUXILIARES =====

// Cargar actividad reciente
async function loadRecentActivity() {
    try {
        const activityList = document.getElementById('activity-list');
        if (!activityList) return;
        
        activityList.innerHTML = `
            <div class="loading-activity">
                <i class="fas fa-spinner fa-spin"></i> Cargando actividad...
            </div>
        `;
        
        const { currentUser } = await import('../app.js');
        const { getUserRecords } = await import('../supabase.js');
        
        const records = await getUserRecords(currentUser.id, 10);
        
        if (records && records.length > 0) {
            activityList.innerHTML = records.map(record => `
                <div class="activity-item ${record.status === 'active' ? 'current' : ''}">
                    <div class="activity-date">
                        <strong>${new Date(record.check_in).toLocaleDateString('es-ES')}</strong>
                        <small>${new Date(record.check_in).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}</small>
                    </div>
                    
                    <div class="activity-times">
                        <div class="time-entry">
                            <span class="time-label">Entrada:</span>
                            <span class="time-value">${new Date(record.check_in).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        
                        ${record.check_out ? `
                            <div class="time-entry">
                                <span class="time-label">Salida:</span>
                                <span class="time-value">${new Date(record.check_out).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                        ` : `
                            <div class="time-entry current-session">
                                <span class="time-label">Estado:</span>
                                <span class="time-value active">En curso</span>
                            </div>
                        `}
                    </div>
                    
                    <div class="activity-hours">
                        <div class="hours-display-small">
                            ${record.total_hours || '--'}
                            <span>horas</span>
                        </div>
                        <div class="activity-status ${record.status}">
                            ${record.status === 'active' ? 'Activo' : 'Completado'}
                        </div>
                    </div>
                </div>
            `).join('');
        } else {
            activityList.innerHTML = `
                <div class="no-activity">
                    <i class="fas fa-clipboard-list"></i>
                    <p>No hay registros aún</p>
                    <small>Registra tu primera entrada para comenzar</small>
                </div>
            `;
        }
        
    } catch (error) {
        console.error('Error cargando actividad:', error);
        const activityList = document.getElementById('activity-list');
        if (activityList) {
            activityList.innerHTML = `
                <div class="error-activity">
                    <i class="fas fa-exclamation-triangle"></i>
                    <p>Error cargando actividad</p>
                    <small>${error.message}</small>
                </div>
            `;
        }
    }
}

// Mostrar notificación
function showNotification(message, type = 'info') {
    // Crear elemento de notificación
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
        <span>${message}</span>
    `;
    
    // Agregar al DOM
    document.body.appendChild(notification);
    
    // Mostrar con animación
    setTimeout(() => notification.classList.add('show'), 10);
    
    // Remover después de 3 segundos
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}