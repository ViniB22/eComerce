// Configuração da API
const API_BASE_URL = 'http://localhost:3000/api';

// Estado global da aplicação
let currentUser = null;
let products = [];
let categories = [];
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Função para mostrar seções
function showSection(sectionId) {
    // Esconder todas as seções
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Mostrar a seção selecionada
    document.getElementById(sectionId).classList.add('active');
    
    // Carregar dados específicos da seção
    if (sectionId === 'products') {
        loadProducts();
        loadCategories();
    } else if (sectionId === 'cart') {
        updateCartDisplay();
    } else if (sectionId === 'orders' && currentUser) {
        loadUserOrders();
    }
}

// Função para verificar autenticação
function checkAuth() {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
        currentUser = JSON.parse(userData);
        updateAuthUI();
    }
}

// Função para atualizar UI baseada na autenticação
function updateAuthUI() {
    const loginBtn = document.getElementById('login-btn');
    const registerBtn = document.getElementById('register-btn');
    const logoutBtn = document.getElementById('logout-btn');
    const userWelcome = document.getElementById('user-welcome');
    
    if (currentUser) {
        loginBtn.style.display = 'none';
        registerBtn.style.display = 'none';
        logoutBtn.style.display = 'inline-block';
        userWelcome.style.display = 'inline-block';
        userWelcome.textContent = `Olá, ${currentUser.nome}`;
    } else {
        loginBtn.style.display = 'inline-block';
        registerBtn.style.display = 'inline-block';
        logoutBtn.style.display = 'none';
        userWelcome.style.display = 'none';
    }
}

// Função de logout
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    currentUser = null;
    updateAuthUI();
    showSection('home');
    alert('Logout realizado com sucesso!');
}

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    checkAuth();
    updateCartCount();
    
    // Verificar se há parâmetros na URL para redirecionamento
    const urlParams = new URLSearchParams(window.location.search);
    const section = urlParams.get('section');
    if (section && document.getElementById(section)) {
        showSection(section);
    }
});