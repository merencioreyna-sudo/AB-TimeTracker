// views/admin.js - Panel de administración
export function renderAdmin() {
    return `
        <div class="admin-container">
            <div class="admin-header">
                <h1><i class="fas fa-cog"></i> Panel de Administración</h1>
                <p>Gestión completa del sistema</p>
            </div>
            
            <div class="admin-stats">
                <div class="stat-card">
                    <h3><i class="fas fa-users"></i> Usuarios Activos</h3>
                    <p class="stat-number" id="active-users">0</p>
                </div>
                
                <div class="stat-card">
                    <h3><i class="fas fa-clock"></i> Registros Hoy</h3>
                    <p class="stat-number" id="today-records">0</p>
                </div>
                
                <div class="stat-card">
                    <h3><i class="fas fa-user-clock"></i> En Turno</h3>
                    <p class="stat-number" id="on-duty">0</p>
                </div>
            </div>
            
            <div class="admin-content">
                <div class="admin-section">
                    <h2><i class="fas fa-list-alt"></i> Registros Recientes</h2>
                    
                    <div class="filters">
                        <input type="date" id="filter-date" class="filter-input">
                        <select id="filter-user" class="filter-input">
                            <option value="">Todos los usuarios</option>
                        </select>
                        <button class="btn-primary" id="filter-btn">
                            <i class="fas fa-filter"></i> Filtrar
                        </button>
                        <button class="btn-secondary" id="export-btn">
                            <i class="fas fa-download"></i> Exportar
                        </button>
                    </div>
                    
                    <div class="table-container">
                        <table class="admin-table">
                            <thead>
                                <tr>
                                    <th>Usuario</th>
                                    <th>Entrada</th>
                                    <th>Salida</th>
                                    <th>Horas</th>
                                    <th>Estado</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody id="records-table-body">
                                <tr>
                                    <td colspan="6" class="loading-table">
                                        <i class="fas fa-spinner fa-spin"></i> Cargando registros...
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    `;
}