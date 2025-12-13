// views/auth.js - Vista de login/registro
export function renderAuth() {
    return `
        <div class="auth-container">
            <div class="auth-card">
                <div class="auth-header">
                    <h1><i class="fas fa-clock"></i> AB TimeTracker</h1>
                    <p>Sistema de registro de asistencia</p>
                </div>
                
                <div class="auth-tabs">
                    <button class="tab-btn active" id="login-tab">Iniciar Sesión</button>
                    <button class="tab-btn" id="register-tab">Registrarse</button>
                </div>
                
                <!-- Formulario Login -->
                <form id="login-form" class="auth-form active">
                    <div class="form-group">
                        <label for="login-email"><i class="fas fa-envelope"></i> Email</label>
                        <input type="email" id="login-email" placeholder="tu@email.com" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="login-password"><i class="fas fa-lock"></i> Contraseña</label>
                        <input type="password" id="login-password" placeholder="••••••••" required>
                    </div>
                    
                    <button type="submit" class="btn-primary btn-auth">
                        <i class="fas fa-sign-in-alt"></i> Ingresar
                    </button>
                    
                    <div class="auth-links">
                        <a href="#/" data-link>Volver al inicio</a>
                    </div>
                </form>
                
                <!-- Formulario Registro -->
                <form id="register-form" class="auth-form">
                    <div class="form-group">
                        <label for="register-email"><i class="fas fa-envelope"></i> Email</label>
                        <input type="email" id="register-email" placeholder="tu@email.com" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="register-password"><i class="fas fa-lock"></i> Contraseña</label>
                        <input type="password" id="register-password" placeholder="••••••••" required minlength="6">
                    </div>
                    
                    <div class="form-group">
                        <label for="confirm-password"><i class="fas fa-lock"></i> Confirmar Contraseña</label>
                        <input type="password" id="confirm-password" placeholder="••••••••" required minlength="6">
                    </div>
                    
                    <button type="submit" class="btn-secondary btn-auth">
                        <i class="fas fa-user-plus"></i> Crear Cuenta
                    </button>
                    
                    <div class="auth-links">
                        <a href="#/" data-link>Volver al inicio</a>
                    </div>
                </form>
            </div>
        </div>
    `;
}