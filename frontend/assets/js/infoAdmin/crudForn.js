let cadastrarFornecedor = document.getElementById("cadastrarFornecedor")
let atualizarFornecedor = document.getElementById("atualizarFornecedor");

let resCad = document.getElementById("resCad")
let resList = document.getElementById("resList")
let resAtul = document.getElementById("resAtul")

const token = sessionStorage.getItem('token')

cadastrarFornecedor.addEventListener("click", () => {
    console.log("Cadastrar Fornecedor")
    let nomeEmpresa = document.getElementById("nomeEmpresa").value
    let cnpj = document.getElementById("cnpj").value
    let email = document.getElementById("email").value
    let telefone = document.getElementById("telefone").value

    let fornecedor = {
        nomeEmpresa: nomeEmpresa,
        cnpj: cnpj,
        email: email,
        telefone: telefone
    }

    fetch("http://localhost:3000/fornecedor", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(fornecedor)
    })
    .then(resp => resp.json())
    .then(dados => {
        if (dados.message) {
            resCad.innerHTML = dados.message
        } else if (dados.erro) {
            resCad.innerHTML = dados.erro
        } else {
            resCad.innerHTML = 'Erro desconhecido'
        }
    })
    .catch(err => {
        console.error(err)
        resCad.innerHTML = 'Erro de rede'
    })

})


atualizarFornecedor.addEventListener("click", () => {
    console.log("Atualizar Fornecedor")
    let id = document.getElementById("codFornecedor").value
    let nomeEmpresa = document.getElementById("nomeEmpresas").value
    let cnpj = document.getElementById("cnpjs").value
    let email = document.getElementById("emails").value
    let telefone = document.getElementById("telefones").value

    let fornecedor = {
        nomeEmpresa: nomeEmpresa,
        cnpj: cnpj,
        email: email,
        telefone: telefone
    }

    fetch(`http://localhost:3000/fornecedor/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(fornecedor)
    })
    .then(resp => resp.json())
    .then(dados => {
        if (dados.message) {
            resAtul.innerHTML = dados.message
        } else if (dados.erro) {
            resAtul.innerHTML = dados.erro
        } else {
            resAtul.innerHTML = 'Erro desconhecido'
        }
    })
    .catch(err => {
        console.error(err)
        resAtul.innerHTML = 'Erro de rede'
    })
})


onload = () => {
    console.log("Listar Fornecedores")
    const token = sessionStorage.getItem('token')
    fetch("http://localhost:3000/fornecedor", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${token}`
        }
    })
    .then(resp => resp.json())
    .then(dados => {
        if (Array.isArray(dados)) {
            resList.innerHTML = `<table>${criarTabela(dados)}</table>`
        } else if (dados.erro) {
            resList.innerHTML = dados.erro
        } else {
            resList.innerHTML = 'Erro desconhecido'
        }
    })
    .catch(err => {
        console.error(err)
        resList.innerHTML = 'Erro de rede'
    })
}
function criarTabela(dados) {
    console.log(dados)
    let tab = `<thead>
                    <th>Código</th>
                    <th>Nome Empresa</th>
                    <th>CNPJ</th>
                    <th>Email</th>
                    <th>Telefone</th>
               </thead>`
    tab += `<tbody>`
    dados.forEach(dad => {
        tab += `<tr>
                    <td>${dad.codFornecedor}</td>
                    <td>${dad.nomeEmpresa}</td>
                    <td>${dad.cnpj}</td>
                    <td>${dad.email || ''}</td>
                    <td>${dad.telefone || ''}</td>
                </tr>`
    })
    tab += `</tbody>`
    return tab
}