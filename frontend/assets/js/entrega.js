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
        fetch(`http://localhost:3000/entregas`)
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
        const dataEstimada = document.getElementById('dataEstimada').value
        const dataEntrega = document.getElementById('dataEntrega').value
        const codigoRastreio = document.getElementById('codigoRastreio').value
        const transportadora = document.getElementById('transportadora').value
        const statusEntrega = document.getElementById('statusEntrega').value

        const valores = {
            idPedido,
            dataEstimada,
            dataEntrega,
            codigoRastreio,
            transportadora,
            statusEntrega
        }

        console.log(valores)

        fetch(`http://localhost:3000/entregas`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(valores)
        })
            .then(resp => resp.json())
            .then(dados => {
                console.log(dados);

                resCad.innerHTML = `Entrega cadastrada: <br>
                            código: ${dados.entrega.codEntrega} <br>
                            ID do pedido: ${dados.entrega.idPedido} <br>
                            data estimada: ${dados.entrega.dataEstimada || '-'} <br>
                            data entrega: ${dados.entrega.dataEntrega || '-'} <br>
                            código rastreio: ${dados.entrega.codigoRastreio || '-'} <br>
                            transportadora: ${dados.entrega.transportadora || '-'} <br>
                            status: ${dados.entrega.statusEntrega} <br>
                            mensagem: ${dados.mensagem} <hr>`
            })
            .catch((err) => {
                console.error('Erro ao cadastrar', err)
            })
    })

    atualizar.addEventListener('click', () => {
        const codEntrega = Number(document.getElementById('codEntregaUp').value)
        const idPedido = Number(document.getElementById('idPedidoUp').value)
        const dataEstimada = document.getElementById('dataEstimadaUp').value
        const dataEntrega = document.getElementById('dataEntregaUp').value
        const codigoRastreio = document.getElementById('codigoRastreioUp').value
        const transportadora = document.getElementById('transportadoraUp').value
        const statusEntrega = document.getElementById('statusEntregaUp').value

        const valores = {
            idPedido,
            dataEstimada,
            dataEntrega,
            codigoRastreio,
            transportadora,
            statusEntrega
        }

        console.log(valores)

        fetch(`http://localhost:3000/entregas/${codEntrega}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(valores)
        })
            .then(resp => resp.json())
            .then(dados => {
                console.log(dados)

                resAtualizar.innerHTML = `Entrega atualizada: <br>
                            código: ${dados.entrega.codEntrega} <br>
                            ID do pedido: ${dados.entrega.idPedido} <br>
                            data estimada: ${dados.entrega.dataEstimada || '-'} <br>
                            data entrega: ${dados.entrega.dataEntrega || '-'} <br>
                            código rastreio: ${dados.entrega.codigoRastreio || '-'} <br>
                            transportadora: ${dados.entrega.transportadora || '-'} <br>
                            status: ${dados.entrega.statusEntrega} <br>
                            mensagem: ${dados.mensagem} <hr>`
            })
            .catch((err) => {
                console.error('Erro ao atualizar', err)
            })
    })

    atualizarParcial.addEventListener('click', () => {
        const codEntrega = Number(document.getElementById('codEntregaPatch').value)
        const statusEntrega = document.getElementById('statusEntregaPatch').value
        const codigoRastreio = document.getElementById('codigoRastreioPatch').value
        const dataEntrega = document.getElementById('dataEntregaPatch').value

        const valores = {}
        if (statusEntrega) valores.statusEntrega = statusEntrega
        if (codigoRastreio) valores.codigoRastreio = codigoRastreio
        if (dataEntrega) valores.dataEntrega = dataEntrega

        console.log(valores)

        fetch(`http://localhost:3000/entregas/${codEntrega}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(valores)
        })
            .then(resp => resp.json())
            .then(dados => {
                console.log(dados)

                resAtualizarParcial.innerHTML = `Entrega atualizada parcialmente: <br>
                            código: ${dados.entrega.codEntrega} <br>
                            status: ${dados.entrega.statusEntrega} <br>
                            código rastreio: ${dados.entrega.codigoRastreio || '-'} <br>
                            data entrega: ${dados.entrega.dataEntrega || '-'} <br>
                            mensagem: ${dados.mensagem} <hr>`
            })
            .catch((err) => {
                console.error('Erro ao atualizar parcial', err)
            })
    })

    apagar.addEventListener('click', () => {
        const codEntrega = Number(document.getElementById('codEntregaDel').value)

        fetch(`http://localhost:3000/entregas/${codEntrega}`, {
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
                    <th>Status</th>
                    <th>Transportadora</th>
                    <th>Código Rastreio</th>
                    <th>Data Estimada</th>
                    <th>Data Entrega</th>
               </thead>`
    tab += `<tbody>`
    dados.forEach(dad => {
        tab += `<tr>
                    <td>${dad.codEntrega}</td>
                    <td>${dad.idPedido}</td>
                    <td>${dad.statusEntrega}</td>
                    <td>${dad.transportadora || '-'}</td>
                    <td>${dad.codigoRastreio || '-'}</td>
                    <td>${dad.dataEstimada || '-'}</td>
                    <td>${dad.dataEntrega || '-'}</td>
                </tr>`
    })
    tab += `</tbody>`
    return tab
}