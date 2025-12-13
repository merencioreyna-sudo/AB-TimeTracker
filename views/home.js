// views/home.js - Vista de inicio/registro de tiempo
import { currentUser } from '../app.js';
import { registerCheckIn, registerCheckOut, getTodayRecord } from '../supabase.js';

export async function renderHome() {
    const user = currentUser;
    const todayRecord = user ? await getTodayRecord(user.id) : null;
    
    return `
        <div class="dashboard">
            <div class="welcome-card">
                <h1><i class="fas fa-user-clock"></i> Bienvenido, ${user ? user.email.split('@')[0] : 'Usuario'}</h1>
                <p>Registra tu jornada laboral</p>
            </div>
            
            <div class="time-cards">
                <div class="time-card ${todayRecord?.check_in ? 'active' : ''}">
                    <h3><i class="fas fa-sign-in-alt"></i> Entrada</h3>
                    <p class="time-display">${todayRecord?.check_in ? 
                        new Date(todayRecord.check_in).toLocaleTimeString() : 
                        '--:--'}</p>
                    ${!todayRecord?.check_in ? `
                        <button class="btn-primary" id="check-in-btn">
                            <i class="fas fa-fingerprint"></i> Registrar Entrada
                        </button>
                    ` : ''}
                </div>
                
                <div class="time-card ${todayRecord?.check_out ? 'active' : ''}">
                    <h3><i class="fas fa-sign-out-alt"></i> Salida</h3>
                    <p class="time-display">${todayRecord?.check_out ? 
                        new Date(todayRecord.check_out).toLocaleTimeString() : 
                        '--:--'}</p>
                    ${todayRecord?.check_in && !todayRecord?.check_out ? `
                        <button class="btn-secondary" id="check-out-btn">
                            <i class="fas fa-fingerprint"></i> Registrar Salida
                        </button>
                    ` : ''}
                </div>
                
                <div class="time-card">
                    <h3><i class="fas fa-clock"></i> Horas Totales</h3>
                    <p class="hours-display">${todayRecord?.total_hours || '0.0'}</p>
                    <p class="hours-label">horas</p>
                </div>
            </div>
            
            <div class="recent-activity">
                <h2><i class="fas fa-history"></i> Actividad Reciente</h2>
                <div id="activity-list" class="activity-list">
                    <!-- Se cargará dinámicamente -->
                    <div class="loading-activity">
                        <i class="fas fa-spinner fa-spin"></i> Cargando actividad...
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Función para conectar eventos (llamada desde app.js)
export function attachHomeEvents() {
    // Botón de entrada
    const checkInBtn = document.getElementById('check-in-btn');
    if (checkInBtn) {
        checkInBtn.addEventListener('click', async () => {
            try {
                const success = await registerCheckIn(currentUser.id);
                if (success) {
                    alert('Entrada registrada correctamente');
                    window.navigateTo('/'); // Recargar vista
                }
            } catch (error) {
                alert('Error: ' + error.message);
            }
        });
    }
    
    // Botón de salida
    const checkOutBtn = document.getElementById('check-out-btn');
    if (checkOutBtn) {
        checkOutBtn.addEventListener('click', async () => {
            try {
                const success = await registerCheckOut(currentUser.id);
                if (success) {
                    alert('Salida registrada correctamente');
                    window.navigateTo('/');
                }
            } catch (error) {
                alert('Error: ' + error.message);
            }
        });
    }
    
    // Cargar actividad reciente
    loadRecentActivity();
}

// Cargar actividad reciente
async function loadRecentActivity() {
    try {
        const { getUserRecords } = await import('../supabase.js');
        const records = await getUserRecords(currentUser.id, 5);
        
        const activityList = document.getElementById('activity-list');
        if (activityList) {
            if (records && records.length > 0) {
                activityList.innerHTML = records.map(record => `
                    <div class="activity-item">
                        <div class="activity-date">
                            ${new Date(record.check_in).toLocaleDateString()}
                        </div>
                        <div class="activity-times">
                            <span class="check-in">Entrada: ${new Date(record.check_in).toLocaleTimeString()}</span>
                            ${record.check_out ? 
                                `<span class="check-out">Salida: ${new Date(record.check_out).toLocaleTimeString()}</span>` : 
                                '<span class="in-progress">En curso</span>'}
                        </div>
                        <div class="activity-hours">
                            ${record.total_hours || '--'} horas
                        </div>
                    </div>
                `).join('');
            } else {
                activityList.innerHTML = '<p class="no-activity">No hay registros recientes</p>';
            }
        }
    } catch (error) {
        console.error('Error cargando actividad:', error);
    }
}