// Funções de autenticação

// Login
document.getElementById('login-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, senha: password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.usuario));
            currentUser = data.usuario;
            updateAuthUI();
            showSection('home');
            alert('Login realizado com sucesso!');
        } else {
            alert(data.error || 'Erro ao fazer login');
        }
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro de conexão');
    }
});

// Registro
document.getElementById('register-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const userData = {
        nome: document.getElementById('register-name').value,
        email: document.getElementById('register-email').value,
        senha: document.getElementById('register-password').value,
        telefone: document.getElementById('register-phone').value
    };
    
    try {
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });
        
        const data = await response.json();
        
        if (response.ok) {
            alert('Cadastro realizado com sucesso! Faça login para continuar.');
            showSection('login');
            document.getElementById('register-form').reset();
        } else {
            alert(data.error || 'Erro ao cadastrar');
        }
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro de conexão');
    }
});