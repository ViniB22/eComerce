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
        fetch(`http://localhost:3000/pagamentos`)
            .then(resp => resp.json())
            .then(dados => {
                resList.innerHTML = `<table>${criarTabela(dados)}</table>`
            })
            .catch((err) => {
                console.error('Erro ao listar', err)
            })
    }

    cadastrar.addEventListener('click', () => {
        const idPedido = document.getElementById('idPedido').value ? Number(document.getElementById('idPedido').value) : null
        const idCompra = document.getElementById('idCompra').value ? Number(document.getElementById('idCompra').value) : null
        const valor = Number(document.getElementById('valor').value)
        const metodo = document.getElementById('metodo').value
        const status = document.getElementById('status').value

        const valores = {
            idPedido,
            idCompra,
            valor,
            metodo,
            status
        }

        console.log(valores)

        fetch(`http://localhost:3000/pagamentos`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(valores)
        })
            .then(resp => resp.json())
            .then(dados => {
                console.log(dados);

                resCad.innerHTML = `Pagamento cadastrado: <br>
                            código: ${dados.pagamento.codPagamento} <br>
                            ID do pedido: ${dados.pagamento.idPedido || '-'} <br>
                            ID da compra: ${dados.pagamento.idCompra || '-'} <br>
                            valor: R$ ${dados.pagamento.valor} <br>
                            método: ${dados.pagamento.metodo} <br>
                            status: ${dados.pagamento.status} <br>
                            data: ${new Date(dados.pagamento.dataPagamento).toLocaleDateString()} <br>
                            mensagem: ${dados.mensagem} <hr>`
            })
            .catch((err) => {
                console.error('Erro ao cadastrar', err)
            })
    })

    atualizar.addEventListener('click', () => {
        const codPagamento = Number(document.getElementById('codPagamentoUp').value)
        const idPedido = Number(document.getElementById('idPedidoUp').value)
        const idCompra = Number(document.getElementById('idCompraUp').value)
        const valor = Number(document.getElementById('valorUp').value)
        const metodo = document.getElementById('metodoUp').value
        const status = document.getElementById('statusUp').value

        const valores = {
            idPedido,
            idCompra,
            valor,
            metodo,
            status
        }

        console.log(valores)

        fetch(`http://localhost:3000/pagamentos/${codPagamento}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(valores)
        })
            .then(resp => resp.json())
            .then(dados => {
                console.log(dados)

                resAtualizar.innerHTML = `Pagamento atualizado: <br>
                            código: ${dados.pagamento.codPagamento} <br>
                            ID do pedido: ${dados.pagamento.idPedido || '-'} <br>
                            ID da compra: ${dados.pagamento.idCompra || '-'} <br>
                            valor: R$ ${dados.pagamento.valor} <br>
                            método: ${dados.pagamento.metodo} <br>
                            status: ${dados.pagamento.status} <br>
                            mensagem: ${dados.mensagem} <hr>`
            })
            .catch((err) => {
                console.error('Erro ao atualizar', err)
            })
    })

    atualizarParcial.addEventListener('click', () => {
        const codPagamento = Number(document.getElementById('codPagamentoPatch').value)
        const status = document.getElementById('statusPatch').value

        const valores = {}
        if (status) valores.status = status

        console.log(valores)

        fetch(`http://localhost:3000/pagamentos/${codPagamento}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(valores)
        })
            .then(resp => resp.json())
            .then(dados => {
                console.log(dados)

                resAtualizarParcial.innerHTML = `Pagamento atualizado parcialmente: <br>
                            código: ${dados.pagamento.codPagamento} <br>
                            status: ${dados.pagamento.status} <br>
                            mensagem: ${dados.mensagem} <hr>`
            })
            .catch((err) => {
                console.error('Erro ao atualizar parcial', err)
            })
    })

    apagar.addEventListener('click', () => {
        const codPagamento = Number(document.getElementById('codPagamentoDel').value)

        fetch(`http://localhost:3000/pagamentos/${codPagamento}`, {
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
                    <th>ID Compra</th>
                    <th>Valor</th>
                    <th>Método</th>
                    <th>Status</th>
                    <th>Data</th>
               </thead>`
    tab += `<tbody>`
    dados.forEach(dad => {
        tab += `<tr>
                    <td>${dad.codPagamento}</td>
                    <td>${dad.idPedido || '-'}</td>
                    <td>${dad.idCompra || '-'}</td>
                    <td>R$ ${dad.valor}</td>
                    <td>${dad.metodo}</td>
                    <td>${dad.status}</td>
                    <td>${new Date(dad.dataPagamento).toLocaleDateString()}</td>
                </tr>`
    })
    tab += `</tbody>`
    return tab
}