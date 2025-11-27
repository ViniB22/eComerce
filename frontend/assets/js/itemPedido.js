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
        fetch(`http://localhost:3000/item-pedido`)
            .then(resp => resp.json())
            .then(dados => {
                resList.innerHTML = `<table>${criarTabela(dados)}</table>`
            })
            .catch((err) => {
                console.error('Erro ao listar', err)
            })
    }

    cadastrar.addEventListener('click', () => {
        const idPedido = Number(document.getElementById('idPedido').value)
        const idProduto = Number(document.getElementById('idProduto').value)
        const quantidade = Number(document.getElementById('quantidade').value)
        const precoUnitario = Number(document.getElementById('precoUnitario').value)

        const valores = {
            idPedido,
            idProduto,
            quantidade,
            precoUnitario
        }

        console.log(valores)

        fetch(`http://localhost:3000/item-pedido`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(valores)
        })
            .then(resp => resp.json())
            .then(dados => {
                console.log(dados);

                resCad.innerHTML = `Item do pedido cadastrado: <br>
                            código: ${dados.itemPedido.codItemPedido} <br>
                            ID do pedido: ${dados.itemPedido.idPedido} <br>
                            ID do produto: ${dados.itemPedido.idProduto} <br>
                            quantidade: ${dados.itemPedido.quantidade} <br>
                            preço unitário: R$ ${dados.itemPedido.precoUnitario} <br>
                            valor total: R$ ${dados.itemPedido.valorTotalItem} <br>
                            mensagem: ${dados.mensagem} <hr>`
            })
            .catch((err) => {
                console.error('Erro ao cadastrar', err)
            })
    })

    atualizar.addEventListener('click', () => {
        const codItemPedido = Number(document.getElementById('codItemPedidoUp').value)
        const idPedido = Number(document.getElementById('idPedidoUp').value)
        const idProduto = Number(document.getElementById('idProdutoUp').value)
        const quantidade = Number(document.getElementById('quantidadeUp').value)
        const precoUnitario = Number(document.getElementById('precoUnitarioUp').value)

        const valores = {
            idPedido,
            idProduto,
            quantidade,
            precoUnitario
        }

        console.log(valores)

        fetch(`http://localhost:3000/item-pedido/${codItemPedido}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(valores)
        })
            .then(resp => resp.json())
            .then(dados => {
                console.log(dados)

                resAtualizar.innerHTML = `Item do pedido atualizado: <br>
                            código: ${dados.itemPedido.codItemPedido} <br>
                            ID do pedido: ${dados.itemPedido.idPedido} <br>
                            ID do produto: ${dados.itemPedido.idProduto} <br>
                            quantidade: ${dados.itemPedido.quantidade} <br>
                            preço unitário: R$ ${dados.itemPedido.precoUnitario} <br>
                            valor total: R$ ${dados.itemPedido.valorTotalItem} <br>
                            mensagem: ${dados.mensagem} <hr>`
            })
            .catch((err) => {
                console.error('Erro ao atualizar', err)
            })
    })

    atualizarParcial.addEventListener('click', () => {
        const codItemPedido = Number(document.getElementById('codItemPedidoPatch').value)
        const quantidade = document.getElementById('quantidadePatch').value ? Number(document.getElementById('quantidadePatch').value) : null
        const precoUnitario = document.getElementById('precoUnitarioPatch').value ? Number(document.getElementById('precoUnitarioPatch').value) : null

        const valores = {}
        if (quantidade !== null) valores.quantidade = quantidade
        if (precoUnitario !== null) valores.precoUnitario = precoUnitario

        console.log(valores)

        fetch(`http://localhost:3000/item-pedido/${codItemPedido}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(valores)
        })
            .then(resp => resp.json())
            .then(dados => {
                console.log(dados)

                resAtualizarParcial.innerHTML = `Item do pedido atualizado parcialmente: <br>
                            código: ${dados.itemPedido.codItemPedido} <br>
                            quantidade: ${dados.itemPedido.quantidade} <br>
                            preço unitário: R$ ${dados.itemPedido.precoUnitario} <br>
                            valor total: R$ ${dados.itemPedido.valorTotalItem} <br>
                            mensagem: ${dados.mensagem} <hr>`
            })
            .catch((err) => {
                console.error('Erro ao atualizar parcial', err)
            })
    })

    apagar.addEventListener('click', () => {
        const codItemPedido = Number(document.getElementById('codItemPedidoDel').value)

        fetch(`http://localhost:3000/item-pedido/${codItemPedido}`, {
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
                    <th>ID Pedido</th>
                    <th>ID Produto</th>
                    <th>Quantidade</th>
                    <th>Preço Unitário</th>
                    <th>Valor Total</th>
               </thead>`
    tab += `<tbody>`
    dados.forEach(dad => {
        tab += `<tr>
                    <td>${dad.codItemPedido}</td>
                    <td>${dad.idPedido}</td>
                    <td>${dad.idProduto}</td>
                    <td>${dad.quantidade}</td>
                    <td>R$ ${dad.precoUnitario}</td>
                    <td>R$ ${dad.valorTotalItem}</td>
                </tr>`
    })
    tab += `</tbody>`
    return tab
}