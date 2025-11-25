let resList = document.getElementById('resList')
let resCad = document.getElementById('resCad')
let resCon = document.getElementById('resCon')
let cadastrar = document.getElementById('cadastrar')
let consultar = document.getElementById('consultar')

let statusLog = localStorage.getItem('statusLog')

if (statusLog === 'true') {
    onload = () => {
        fetch(`http://localhost:3000/api/pedido?statusLog=${statusLog}`)
            .then(resp => resp.json())
            .then(dados => {
                resList.innerHTML = `<table>${criarTabelaPedidos(dados)}</table>`
            })
            .catch((err) => {
                console.error('Erro ao listar pedidos', err)
            })
    }

    cadastrar.addEventListener('click', () => {
        const idUsuario = Number(document.getElementById('idUsuario').value)
        const idEndereco = Number(document.getElementById('idEndereco').value)
        const valorTotal = Number(document.getElementById('valorTotal').value)
        const metodoPagamento = document.getElementById('metodoPagamento').value

        const valores = {
            idUsuario,
            idEndereco,
            valorTotal,
            metodoPagamento
        }

        console.log(valores)

        fetch(`http://localhost:3000/api/pedido?statusLog=${statusLog}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(valores)
        })
            .then(resp => resp.json())
            .then(dados => {
                console.log(dados);

                resCad.innerHTML = `Pedido criado: <br>
                            código: ${dados.codPedido} <br>
                            data: ${dados.dataPedido} <br>
                            status: ${dados.status} <br>
                            valor total: R$ ${dados.valorTotal} <hr>`
            })
            .catch((err) => {
                console.error('Erro ao criar pedido', err)
            })
    })

    consultar.addEventListener('click', () => {
        const codPedido = Number(document.getElementById('codPedido').value)
        
        fetch(`http://localhost:3000/api/pedido/${codPedido}?statusLog=${statusLog}`)
            .then(resp => resp.json())
            .then(dados => {
                console.log(dados);

                resCon.innerHTML = `Pedido encontrado: <br>
                            código: ${dados.codPedido} <br>
                            data: ${dados.dataPedido} <br>
                            status: ${dados.status} <br>
                            valor total: R$ ${dados.valorTotal} <hr>`
            })
            .catch((err) => {
                console.error('Erro ao consultar pedido', err)
            })
    })
} else {
    location.href = '../index.html'
}

function criarTabelaPedidos(dados) {
    console.log(dados)
    let tab = `<thead>
                    <th>Código</th>
                    <th>Data</th>
                    <th>Status</th>
                    <th>Valor Total</th>
                    <th>Método Pagamento</th>
               </thead>`
    tab += `<tbody>`
    dados.forEach(dad => {
        tab += `<tr>
                    <td>${dad.codPedido}</td>
                    <td>${new Date(dad.dataPedido).toLocaleDateString()}</td>
                    <td>${dad.status}</td>
                    <td>R$ ${dad.valorTotal}</td>
                    <td>${dad.metodoPagamento || 'N/A'}</td>
                </tr>`
    })
    tab += `</tbody>`
    return tab
}