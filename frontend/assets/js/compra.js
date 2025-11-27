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
        fetch(`http://localhost:3000/compras`)
            .then(resp => resp.json())
            .then(dados => {
                resList.innerHTML = `<table>${criarTabela(dados)}</table>`
            })
            .catch((err) => {
                console.error('Erro ao listar', err)
            })
    }

    cadastrar.addEventListener('click', () => {
        const referenciaFornecedor = document.getElementById('referenciaFornecedor').value
        const numeroDocumento = document.getElementById('numeroDocumento').value
        const valorTotal = Number(document.getElementById('valorTotal').value)
        const statusCompra = document.getElementById('statusCompra').value

        const valores = {
            referenciaFornecedor,
            numeroDocumento,
            valorTotal,
            statusCompra
        }

        console.log(valores)

        fetch(`http://localhost:3000/compras`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(valores)
        })
            .then(resp => resp.json())
            .then(dados => {
                console.log(dados);

                resCad.innerHTML = `Compra cadastrada: <br>
                            código: ${dados.compra.codCompra} <br>
                            referência: ${dados.compra.referenciaFornecedor} <br>
                            documento: ${dados.compra.numeroDocumento || '-'} <br>
                            valor total: R$ ${dados.compra.valorTotal} <br>
                            status: ${dados.compra.statusCompra} <br>
                            data: ${new Date(dados.compra.dataCompra).toLocaleDateString()} <br>
                            mensagem: ${dados.mensagem} <hr>`
            })
            .catch((err) => {
                console.error('Erro ao cadastrar', err)
            })
    })

    atualizar.addEventListener('click', () => {
        const codCompra = Number(document.getElementById('codCompraUp').value)
        const referenciaFornecedor = document.getElementById('referenciaFornecedorUp').value
        const numeroDocumento = document.getElementById('numeroDocumentoUp').value
        const valorTotal = Number(document.getElementById('valorTotalUp').value)
        const statusCompra = document.getElementById('statusCompraUp').value

        const valores = {
            referenciaFornecedor,
            numeroDocumento,
            valorTotal,
            statusCompra
        }

        console.log(valores)

        fetch(`http://localhost:3000/compras/${codCompra}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(valores)
        })
            .then(resp => resp.json())
            .then(dados => {
                console.log(dados)

                resAtualizar.innerHTML = `Compra atualizada: <br>
                            código: ${dados.compra.codCompra} <br>
                            referência: ${dados.compra.referenciaFornecedor} <br>
                            documento: ${dados.compra.numeroDocumento || '-'} <br>
                            valor total: R$ ${dados.compra.valorTotal} <br>
                            status: ${dados.compra.statusCompra} <br>
                            mensagem: ${dados.mensagem} <hr>`
            })
            .catch((err) => {
                console.error('Erro ao atualizar', err)
            })
    })

    atualizarParcial.addEventListener('click', () => {
        const codCompra = Number(document.getElementById('codCompraPatch').value)
        const statusCompra = document.getElementById('statusCompraPatch').value
        const numeroDocumento = document.getElementById('numeroDocumentoPatch').value

        const valores = {}
        if (statusCompra) valores.statusCompra = statusCompra
        if (numeroDocumento) valores.numeroDocumento = numeroDocumento

        console.log(valores)

        fetch(`http://localhost:3000/compras/${codCompra}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(valores)
        })
            .then(resp => resp.json())
            .then(dados => {
                console.log(dados)

                resAtualizarParcial.innerHTML = `Compra atualizada parcialmente: <br>
                            código: ${dados.compra.codCompra} <br>
                            status: ${dados.compra.statusCompra} <br>
                            documento: ${dados.compra.numeroDocumento || '-'} <br>
                            mensagem: ${dados.mensagem} <hr>`
            })
            .catch((err) => {
                console.error('Erro ao atualizar parcial', err)
            })
    })

    apagar.addEventListener('click', () => {
        const codCompra = Number(document.getElementById('codCompraDel').value)

        fetch(`http://localhost:3000/compras/${codCompra}`, {
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
                    <th>Referência</th>
                    <th>Documento</th>
                    <th>Valor Total</th>
                    <th>Status</th>
                    <th>Data</th>
               </thead>`
    tab += `<tbody>`
    dados.forEach(dad => {
        tab += `<tr>
                    <td>${dad.codCompra}</td>
                    <td>${dad.referenciaFornecedor}</td>
                    <td>${dad.numeroDocumento || '-'}</td>
                    <td>R$ ${dad.valorTotal}</td>
                    <td>${dad.statusCompra}</td>
                    <td>${new Date(dad.dataCompra).toLocaleDateString()}</td>
                </tr>`
    })
    tab += `</tbody>`
    return tab
}