// Configuração da API
const API_BASE_URL = 'http://localhost:3000';

// Headers padrão
function getHeaders() {
    const token = localStorage.getItem('token');
    const headers = {
        'Content-Type': 'application/json'
    };
    
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    
    return headers;
}

// Função de fetch genérica
async function apiFetch(endpoint, options = {}) {
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            headers: getHeaders(),
            ...options
        });
        
        if (response.status === 401) {
            // Token expirado
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            currentUser = null;
            updateAuthUI();
            showSection('login');
            throw new Error('Sessão expirada. Faça login novamente.');
        }
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'Erro na requisição');
        }
        
        return data;
    } catch (error) {
        console.error('Erro na API:', error);
        throw error;
    }
}