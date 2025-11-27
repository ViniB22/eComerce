let res = document.getElementById('res')
let login = document.getElementById('loginButton')
let logout = document.getElementById('btnLogout')

// Verifica se o usuário já está logado ao carregar a página
window.addEventListener('DOMContentLoaded', () => {
    const token = sessionStorage.getItem('token')
    const nomeUsuario = sessionStorage.getItem('nome')
    
    if (token === 'true' && nomeUsuario) {
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
        sessionStorage.setItem('token', dados.token)
        sessionStorage.setItem('nome', dados.usuario.nome)
        sessionStorage.setItem('tipo', dados.usuario.tipo)

        res.innerHTML = 'Login realizado com sucesso!'
        
        setTimeout(() => {
            
            // Redirecionar conforme tipo
            if(dados.usuario.tipo === 'ADMIN') {

                location.href = './produto.html'
            }else{

                location.href = './carrinho.html'
            }
        }, 1500)
    })
    .catch((err) => {
        console.error('Erro ao login', err)
        res.innerHTML = 'Erro ao fazer login. Tente novamente.'
    })
})

logout.addEventListener('click', () => {
    localStorage.clear()
    logout.style.display = 'none'
    login.style.display = 'inline-block'
})