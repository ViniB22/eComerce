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
        fetch(`http://localhost:3000/itens-compra`)
            .then(resp => resp.json())
            .then(dados => {
                resList.innerHTML = `<table>${criarTabela(dados)}</table>`
            })
            .catch((err) => {
                console.error('Erro ao listar', err)
            })
    }

    cadastrar.addEventListener('click', () => {
        const idCompra = Number(document.getElementById('idCompra').value)
        const idProduto = Number(document.getElementById('idProduto').value)
        const quantidade = Number(document.getElementById('quantidade').value)
        const custoUnitario = Number(document.getElementById('custoUnitario').value)

        const valores = {
            idCompra,
            idProduto,
            quantidade,
            custoUnitario
        }

        console.log(valores)

        fetch(`http://localhost:3000/itens-compra`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(valores)
        })
            .then(resp => resp.json())
            .then(dados => {
                console.log(dados);

                resCad.innerHTML = `Item da compra cadastrado: <br>
                            código: ${dados.itemCompra.codItemCompra} <br>
                            ID da compra: ${dados.itemCompra.idCompra} <br>
                            ID do produto: ${dados.itemCompra.idProduto} <br>
                            quantidade: ${dados.itemCompra.quantidade} <br>
                            custo unitário: R$ ${dados.itemCompra.custoUnitario} <br>
                            mensagem: ${dados.mensagem} <hr>`
            })
            .catch((err) => {
                console.error('Erro ao cadastrar', err)
            })
    })

    atualizar.addEventListener('click', () => {
        const codItemCompra = Number(document.getElementById('codItemCompraUp').value)
        const idCompra = Number(document.getElementById('idCompraUp').value)
        const idProduto = Number(document.getElementById('idProdutoUp').value)
        const quantidade = Number(document.getElementById('quantidadeUp').value)
        const custoUnitario = Number(document.getElementById('custoUnitarioUp').value)

        const valores = {
            idCompra,
            idProduto,
            quantidade,
            custoUnitario
        }

        console.log(valores)

        fetch(`http://localhost:3000/itens-compra/${codItemCompra}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(valores)
        })
            .then(resp => resp.json())
            .then(dados => {
                console.log(dados)

                resAtualizar.innerHTML = `Item da compra atualizado: <br>
                            código: ${dados.itemCompra.codItemCompra} <br>
                            ID da compra: ${dados.itemCompra.idCompra} <br>
                            ID do produto: ${dados.itemCompra.idProduto} <br>
                            quantidade: ${dados.itemCompra.quantidade} <br>
                            custo unitário: R$ ${dados.itemCompra.custoUnitario} <br>
                            mensagem: ${dados.mensagem} <hr>`
            })
            .catch((err) => {
                console.error('Erro ao atualizar', err)
            })
    })

    atualizarParcial.addEventListener('click', () => {
        const codItemCompra = Number(document.getElementById('codItemCompraPatch').value)
        const quantidade = document.getElementById('quantidadePatch').value ? Number(document.getElementById('quantidadePatch').value) : null
        const custoUnitario = document.getElementById('custoUnitarioPatch').value ? Number(document.getElementById('custoUnitarioPatch').value) : null

        const valores = {}
        if (quantidade !== null) valores.quantidade = quantidade
        if (custoUnitario !== null) valores.custoUnitario = custoUnitario

        console.log(valores)

        fetch(`http://localhost:3000/itens-compra/${codItemCompra}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(valores)
        })
            .then(resp => resp.json())
            .then(dados => {
                console.log(dados)

                resAtualizarParcial.innerHTML = `Item da compra atualizado parcialmente: <br>
                            código: ${dados.itemCompra.codItemCompra} <br>
                            quantidade: ${dados.itemCompra.quantidade} <br>
                            custo unitário: R$ ${dados.itemCompra.custoUnitario} <br>
                            mensagem: ${dados.mensagem} <hr>`
            })
            .catch((err) => {
                console.error('Erro ao atualizar parcial', err)
            })
    })

    apagar.addEventListener('click', () => {
        const codItemCompra = Number(document.getElementById('codItemCompraDel').value)

        fetch(`http://localhost:3000/itens-compra/${codItemCompra}`, {
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
                    <th>ID Compra</th>
                    <th>ID Produto</th>
                    <th>Quantidade</th>
                    <th>Custo Unitário</th>
               </thead>`
    tab += `<tbody>`
    dados.forEach(dad => {
        tab += `<tr>
                    <td>${dad.codItemCompra}</td>
                    <td>${dad.idCompra}</td>
                    <td>${dad.idProduto}</td>
                    <td>${dad.quantidade}</td>
                    <td>R$ ${dad.custoUnitario}</td>
                </tr>`
    })
    tab += `</tbody>`
    return tab
}