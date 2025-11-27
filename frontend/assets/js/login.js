let res = document.getElementById('res')
let nome = document.getElementById('nome')
let login = document.getElementById('login')
let logout = document.getElementById('logout')

// Verifica se o usuário já está logado ao carregar a página
window.addEventListener('DOMContentLoaded', () => {
    const statusLog = localStorage.getItem('statusLog')
    const nomeUsuario = localStorage.getItem('nome')
    
    if (statusLog === 'true' && nomeUsuario) {
        nome.innerHTML = `Nome: ${nomeUsuario}`
        res.innerHTML = `Você já está logado!`
        logout.style.display = 'inline-block'
        login.style.display = 'none'
    }
})

login.addEventListener('click', () => {
    const email = document.getElementById('email').value
    const senha = document.getElementById('senha').value

    const valores = {
        email: email,
        senha: senha
    }
    
    console.log(valores)
    
    fetch(`http://localhost:3000/login`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(valores)
    })
    .then(resp => resp.json())
    .then(dados => {
        localStorage.setItem('statusLog', dados.statusLog)
        localStorage.setItem('nome', dados.nome)

        nome.innerHTML = `Nome: ${dados.nome}`
        res.innerHTML = `${dados.message}`
        
        if (dados.statusLog === 'true') {
            logout.style.display = 'inline-block'
            login.style.display = 'none'
        }
    })
    .catch((err) => {
        console.error('Erro ao login', err)
        res.innerHTML = 'Erro ao fazer login. Tente novamente.'
    })
})

logout.addEventListener('click', () => {
    localStorage.clear()
    nome.innerHTML = ''
    res.innerHTML = 'Você saiu do sistema.'
    logout.style.display = 'none'
    login.style.display = 'inline-block'
})