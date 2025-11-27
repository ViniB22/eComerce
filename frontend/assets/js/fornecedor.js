let resList = document.getElementById('resList')
let resCad = document.getElementById('resCad')
let resAtualizar = document.getElementById('resAtualizar')
let resAtualizarParcial = document.getElementById('resAtualizarParcial')
let resDel = document.getElementById('resDel')
let cadastrar = document.getElementById('cadastrar')
let atualizar = document.getElementById('atualizar')
let atualizarParcial = document.getElementById('atualizarParcial')
let apagar = document.getElementById('apagar')

let statusLog = localStorage.getItem('statusLog')

if (statusLog === 'true') {
    onload = () => {
        fetch(`http://localhost:3000/fornecedores`)
            .then(resp => resp.json())
            .then(dados => {
                resList.innerHTML = `<table>${criarTabela(dados)}</table>`
            })
            .catch((err) => {
                console.error('Erro ao listar', err)
            })
    }

    cadastrar.addEventListener('click', () => {
        const nomeEmpresa = document.getElementById('nomeEmpresa').value
        const cnpj = document.getElementById('cnpj').value
        const email = document.getElementById('email').value
        const telefone = document.getElementById('telefone').value

        const valores = {
            nomeEmpresa,
            cnpj,
            email,
            telefone
        }

        console.log(valores)

        fetch(`http://localhost:3000/fornecedores`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(valores)
        })
            .then(resp => resp.json())
            .then(dados => {
                console.log(dados);

                resCad.innerHTML = `Fornecedor cadastrado: <br>
                            código: ${dados.fornecedor.codFornecedor} <br>
                            nome da empresa: ${dados.fornecedor.nomeEmpresa} <br>
                            CNPJ: ${dados.fornecedor.cnpj} <br>
                            email: ${dados.fornecedor.email} <br>
                            telefone: ${dados.fornecedor.telefone} <br>
                            mensagem: ${dados.mensagem} <hr>`
            })
            .catch((err) => {
                console.error('Erro ao cadastrar', err)
            })
    })

    atualizar.addEventListener('click', () => {
        const codFornecedor = Number(document.getElementById('codFornecedorUp').value)
        const nomeEmpresa = document.getElementById('nomeEmpresaUp').value
        const cnpj = document.getElementById('cnpjUp').value
        const email = document.getElementById('emailUp').value
        const telefone = document.getElementById('telefoneUp').value

        const valores = {
            nomeEmpresa,
            cnpj,
            email,
            telefone
        }

        console.log(valores)

        fetch(`http://localhost:3000/fornecedores/${codFornecedor}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(valores)
        })
            .then(resp => resp.json())
            .then(dados => {
                console.log(dados)

                resAtualizar.innerHTML = `Fornecedor atualizado: <br>
                            código: ${dados.fornecedor.codFornecedor} <br>
                            nome da empresa: ${dados.fornecedor.nomeEmpresa} <br>
                            CNPJ: ${dados.fornecedor.cnpj} <br>
                            email: ${dados.fornecedor.email} <br>
                            telefone: ${dados.fornecedor.telefone} <br>
                            mensagem: ${dados.mensagem} <hr>`
            })
            .catch((err) => {
                console.error('Erro ao atualizar', err)
            })
    })

    atualizarParcial.addEventListener('click', () => {
        const codFornecedor = Number(document.getElementById('codFornecedorPatch').value)
        const nomeEmpresa = document.getElementById('nomeEmpresaPatch').value
        const email = document.getElementById('emailPatch').value
        const telefone = document.getElementById('telefonePatch').value

        const valores = {}
        if (nomeEmpresa) valores.nomeEmpresa = nomeEmpresa
        if (email) valores.email = email
        if (telefone) valores.telefone = telefone

        console.log(valores)

        fetch(`http://localhost:3000/fornecedores/${codFornecedor}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(valores)
        })
            .then(resp => resp.json())
            .then(dados => {
                console.log(dados)

                resAtualizarParcial.innerHTML = `Fornecedor atualizado parcialmente: <br>
                            código: ${dados.fornecedor.codFornecedor} <br>
                            nome da empresa: ${dados.fornecedor.nomeEmpresa} <br>
                            email: ${dados.fornecedor.email} <br>
                            telefone: ${dados.fornecedor.telefone} <br>
                            mensagem: ${dados.mensagem} <hr>`
            })
            .catch((err) => {
                console.error('Erro ao atualizar parcial', err)
            })
    })

    apagar.addEventListener('click', () => {
        const codFornecedor = Number(document.getElementById('codFornecedorDel').value)

        fetch(`http://localhost:3000/fornecedores/${codFornecedor}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' }
        })
            .then(resp => resp.json())
            .then(dados => {
                resDel.innerHTML = `${dados.mensagem}`
            })
            .catch((err) => {
                console.error('Erro ao apagar', err)
            })
    })
} else {
    location.href = '../index.html'
}

function criarTabela(dados) {
    console.log(dados)
    let tab = `<thead>
                    <th>Código</th>
                    <th>Nome da Empresa</th>
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
                    <td>${dad.email || '-'}</td>
                    <td>${dad.telefone || '-'}</td>
                </tr>`
    })
    tab += `</tbody>`
    return tab
}