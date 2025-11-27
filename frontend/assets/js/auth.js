// assets/js/auth.js
class AuthService {
    constructor() {
        this.baseURL = 'http://localhost:3000';
        this.token = sessionStorage.getItem('token');
    }
    // Adicione esta função à classe AuthService no auth.js
    logout() {
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('usuario');
        sessionStorage.removeItem('carrinho');
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
            sessionStorage.setItem('token', data.token)
            sessionStorage.setItem('nome', data.usuario.nome)
            sessionStorage.setItem('tipo', data.usuario.tipo)

            return data;
        } catch (error) {
            throw error;
        }
    }

    logout() {
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('usuario');
        sessionStorage.removeItem('tipo');
        window.location.href = '../index.html';
    }

    getToken() {
        return this.token;
    }

    getUsuario() {
        const usuario = sessionStorage.getItem('usuario');
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

                // Redirecionar conforme tipo
                if (dados.usuario.tipo === 'ADMIN') {

                    location.href = './produto.html'
                } else {

                    location.href = './carrinho.html'
                }
            }, 1500)

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
        btnLogout.addEventListener('click', function () {
            if (confirm('Tem certeza que deseja sair?')) {
                authService.logout();
            }
        });
    }
});