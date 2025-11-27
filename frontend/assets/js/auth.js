// assets/js/auth.js
class AuthService {
    constructor() {
        this.baseURL = 'http://localhost:3000';
        this.token = localStorage.getItem('token');
    }
    // Adicione esta função à classe AuthService no auth.js
    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('usuario');
        localStorage.removeItem('carrinho');
        window.location.href = '../index.html'; // Volta para a página inicial
    }    

    async login(email, senha) {
        try {
            const response = await fetch(`${this.baseURL}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, senha })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Erro ao fazer login');
            }

            // Salva token e dados do usuário
            localStorage.setItem('token', data.token);
            localStorage.setItem('usuario', JSON.stringify(data.usuario));

            return data;
        } catch (error) {
            throw error;
        }
    }

    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('usuario');
        window.location.href = '../login.html';
    }

    getToken() {
        return this.token;
    }

    getUsuario() {
        const usuario = localStorage.getItem('usuario');
        return usuario ? JSON.parse(usuario) : null;
    }

    isAuthenticated() {
        return !!this.token;
    }

    isAdmin() {
        const usuario = this.getUsuario();
        return usuario && usuario.tipo === 'ADMIN';
    }
}

// Instância global do serviço de autenticação
const authService = new AuthService();

// Manipulação do formulário de login
document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById('loginForm');
    const messageDiv = document.getElementById('message');
    const loginButton = document.getElementById('loginButton');

    if (loginForm) {
        loginForm.addEventListener('submit', async function (e) {
            e.preventDefault();

            const email = document.getElementById('email').value;
            const senha = document.getElementById('senha').value;

            // Validação básica
            if (!email || !senha) {
                showMessage('Por favor, preencha todos os campos.', 'error');
                return;
            }

            try {
                // Mostrar loading
                loginButton.disabled = true;
                loginButton.textContent = 'Entrando...';
                loginForm.classList.add('loading');

                // Fazer login
                const result = await authService.login(email, senha);

                showMessage('Login realizado com sucesso!', 'success');

                // Redirecionar após breve delay
                setTimeout(() => {
                    window.location.href = '../index.html';
                }, 1000);

            } catch (error) {
                showMessage(error.message, 'error');
            } finally {
                // Restaurar botão
                loginButton.disabled = false;
                loginButton.textContent = 'Entrar';
                loginForm.classList.remove('loading');
            }
        });
    }

    function showMessage(message, type) {
        messageDiv.textContent = message;
        messageDiv.className = `auth-message ${type}`;
        messageDiv.style.display = 'block';

        // Auto-esconder após 5 segundos
        setTimeout(() => {
            messageDiv.style.display = 'none';
        }, 5000);
    }
    const btnLogout = document.getElementById('btnLogout');
    if (btnLogout) {
        btnLogout.addEventListener('click', function() {
            if (confirm('Tem certeza que deseja sair?')) {
                authService.logout();
            }
        });
    }
});