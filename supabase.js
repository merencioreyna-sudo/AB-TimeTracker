// supabase.js - Configuración y funciones de Supabase
const SUPABASE_URL = 'https://zcogboficxfnyofxmpne.supabase.co'; // Reemplazar
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpjb2dib2ZpY3hmbnlvZnhtcG5lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU1NDE3MjUsImV4cCI6MjA4MTExNzcyNX0.-VwNBH-Xt817zAoDCFgGcse4YClmMZMME8cKzbH8sx4'; // Reemplazar

// Inicializar Supabase
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// ===== FUNCIONES DE AUTENTICACIÓN =====
export async function signUp(email, password) {
    try {
        const { data, error } = await supabase.auth.signUp({
            email,
            password
        });
        
        if (error) throw error;
        
        alert('¡Registro exitoso! Verifica tu email.');
        window.navigateTo('/login');
        return data;
    } catch (error) {
        alert('Error en registro: ' + error.message);
        throw error;
    }
}

export async function signIn(email, password) {
    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });
        
        if (error) throw error;
        
        alert('¡Bienvenido!');
        window.navigateTo('/');
        return data;
    } catch (error) {
        alert('Error en login: ' + error.message);
        throw error;
    }
}

export async function signOut() {
    try {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
        
        alert('Sesión cerrada');
        return true;
    } catch (error) {
        console.error('Error cerrando sesión:', error);
        return false;
    }
}

export async function getCurrentUser() {
    const { data } = await supabase.auth.getUser();
    return data?.user || null;
}

export async function checkAuthState() {
    const { data } = await supabase.auth.getSession();
    return {
        user: data?.session?.user || null,
        session: data?.session || null
    };
}

// ===== FUNCIONES DE REGISTRO DE TIEMPO =====
export async function registerCheckIn(userId) {
    try {
        const { data, error } = await supabase
            .from('time_records')
            .insert([
                {
                    user_id: userId,
                    check_in: new Date().toISOString(),
                    status: 'active'
                }
            ]);
        
        if (error) throw error;
        return true;
    } catch (error) {
        console.error('Error registrando entrada:', error);
        throw error;
    }
}

export async function registerCheckOut(userId) {
    try {
        // Obtener registro activo
        const { data: activeRecord, error: fetchError } = await supabase
            .from('time_records')
            .select('*')
            .eq('user_id', userId)
            .is('check_out', null)
            .single();
        
        if (fetchError) throw fetchError;
        
        // Calcular horas trabajadas
        const checkIn = new Date(activeRecord.check_in);
        const checkOut = new Date();
        const diffMs = checkOut - checkIn;
        const diffHours = (diffMs / (1000 * 60 * 60)).toFixed(2);
        
        // Actualizar registro
        const { error: updateError } = await supabase
            .from('time_records')
            .update({
                check_out: checkOut.toISOString(),
                total_hours: diffHours,
                status: 'completed'
            })
            .eq('id', activeRecord.id);
        
        if (updateError) throw updateError;
        return true;
    } catch (error) {
        console.error('Error registrando salida:', error);
        throw error;
    }
}

export async function getTodayRecord(userId) {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const { data, error } = await supabase
            .from('time_records')
            .select('*')
            .eq('user_id', userId)
            .gte('check_in', today.toISOString())
            .order('check_in', { ascending: false })
            .limit(1)
            .single();
        
        if (error && error.code !== 'PGRST116') throw error;
        return data || null;
    } catch (error) {
        console.error('Error obteniendo registro de hoy:', error);
        return null;
    }
}

export async function getUserRecords(userId, limit = 10) {
    try {
        const { data, error } = await supabase
            .from('time_records')
            .select('*')
            .eq('user_id', userId)
            .order('check_in', { ascending: false })
            .limit(limit);
        
        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error obteniendo registros:', error);
        return [];
    }
}

export async function getTimeRecords(filters = {}) {
    try {
        let query = supabase
            .from('time_records')
            .select(`
                *,
                user:user_id(email)
            `)
            .order('check_in', { ascending: false });
        
        // Aplicar filtros
        if (filters.date) {
            const startDate = new Date(filters.date);
            const endDate = new Date(filters.date);
            endDate.setDate(endDate.getDate() + 1);
            
            query = query
                .gte('check_in', startDate.toISOString())
                .lt('check_in', endDate.toISOString());
        }
        
        if (filters.user_id) {
            query = query.eq('user_id', filters.user_id);
        }
        
        const { data, error } = await query.limit(50);
        
        if (error) throw error;
        
        // Formatear datos
        return data.map(record => ({
            ...record,
            user_email: record.user?.email || 'Usuario'
        }));
    } catch (error) {
        console.error('Error obteniendo registros:', error);
        return [];
    }
}