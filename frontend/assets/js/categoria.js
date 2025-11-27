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
        fetch(`http://localhost:3000/categorias`)
            .then(resp => resp.json())
            .then(dados => {
                resList.innerHTML = `<table>${criarTabela(dados)}</table>`
            })
            .catch((err) => {
                console.error('Erro ao listar', err)
            })
    }

    cadastrar.addEventListener('click', () => {
        const nome = document.getElementById('nome').value
        const descricao = document.getElementById('descricao').value

        const valores = {
            nome,
            descricao
        }

        console.log(valores)

        fetch(`http://localhost:3000/categorias`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(valores)
        })
            .then(resp => resp.json())
            .then(dados => {
                console.log(dados);

                resCad.innerHTML = `Categoria cadastrada: <br>
                            código: ${dados.categoria.codCategoria} <br>
                            nome: ${dados.categoria.nome} <br>
                            descrição: ${dados.categoria.descricao} <br>
                            mensagem: ${dados.mensagem} <hr>`
            })
            .catch((err) => {
                console.error('Erro ao cadastrar', err)
            })
    })

    atualizar.addEventListener('click', () => {
        const codCategoria = Number(document.getElementById('codCategoriaUp').value)
        const nome = document.getElementById('nomeUp').value
        const descricao = document.getElementById('descricaoUp').value

        const valores = {
            nome,
            descricao
        }

        console.log(valores)

        fetch(`http://localhost:3000/categorias/${codCategoria}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(valores)
        })
            .then(resp => resp.json())
            .then(dados => {
                console.log(dados)

                resAtualizar.innerHTML = `Categoria atualizada: <br>
                            código: ${dados.categoria.codCategoria} <br>
                            nome: ${dados.categoria.nome} <br>
                            descrição: ${dados.categoria.descricao} <br>
                            mensagem: ${dados.mensagem} <hr>`
            })
            .catch((err) => {
                console.error('Erro ao atualizar', err)
            })
    })

    atualizarParcial.addEventListener('click', () => {
        const codCategoria = Number(document.getElementById('codCategoriaPatch').value)
        const nome = document.getElementById('nomePatch').value
        const descricao = document.getElementById('descricaoPatch').value

        const valores = {}
        if (nome) valores.nome = nome
        if (descricao) valores.descricao = descricao

        console.log(valores)

        fetch(`http://localhost:3000/categorias/${codCategoria}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(valores)
        })
            .then(resp => resp.json())
            .then(dados => {
                console.log(dados)

                resAtualizarParcial.innerHTML = `Categoria atualizada parcialmente: <br>
                            código: ${dados.categoria.codCategoria} <br>
                            nome: ${dados.categoria.nome} <br>
                            descrição: ${dados.categoria.descricao} <br>
                            mensagem: ${dados.mensagem} <hr>`
            })
            .catch((err) => {
                console.error('Erro ao atualizar parcial', err)
            })
    })

    apagar.addEventListener('click', () => {
        const codCategoria = Number(document.getElementById('codCategoriaDel').value)

        fetch(`http://localhost:3000/categorias/${codCategoria}`, {
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
                    <th>Nome</th>
                    <th>Descrição</th>
                    <th>Status</th>
               </thead>`
    tab += `<tbody>`
    dados.forEach(dad => {
        tab += `<tr>
                    <td>${dad.codCategoria}</td>
                    <td>${dad.nome}</td>
                    <td>${dad.descricao || '-'}</td>
                    <td>${dad.is_ativo ? 'Ativo' : 'Inativo'}</td>
                </tr>`
    })
    tab += `</tbody>`
    return tab
}