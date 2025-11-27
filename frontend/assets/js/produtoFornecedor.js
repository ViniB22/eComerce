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
        fetch(`http://localhost:3000/produto-fornecedor`)
            .then(resp => resp.json())
            .then(dados => {
                resList.innerHTML = `<table>${criarTabela(dados)}</table>`
            })
            .catch((err) => {
                console.error('Erro ao listar', err)
            })
    }

    cadastrar.addEventListener('click', () => {
        const idProduto = Number(document.getElementById('idProduto').value)
        const idFornecedor = Number(document.getElementById('idFornecedor').value)
        const custoUnitarioAtual = document.getElementById('custoUnitarioAtual').value ? Number(document.getElementById('custoUnitarioAtual').value) : null
        const codigoReferencia = document.getElementById('codigoReferencia').value

        const valores = {
            idProduto,
            idFornecedor,
            custoUnitarioAtual,
            codigoReferencia
        }

        console.log(valores)

        fetch(`http://localhost:3000/produto-fornecedor`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(valores)
        })
            .then(resp => resp.json())
            .then(dados => {
                console.log(dados);

                resCad.innerHTML = `Relação produto-fornecedor cadastrada: <br>
                            código: ${dados.produtoFornecedor.codProdutoFornecedor} <br>
                            ID do produto: ${dados.produtoFornecedor.idProduto} <br>
                            ID do fornecedor: ${dados.produtoFornecedor.idFornecedor} <br>
                            custo unitário: ${dados.produtoFornecedor.custoUnitarioAtual ? 'R$ ' + dados.produtoFornecedor.custoUnitarioAtual : '-'} <br>
                            código referência: ${dados.produtoFornecedor.codigoReferencia || '-'} <br>
                            mensagem: ${dados.mensagem} <hr>`
            })
            .catch((err) => {
                console.error('Erro ao cadastrar', err)
            })
    })

    atualizar.addEventListener('click', () => {
        const codProdutoFornecedor = Number(document.getElementById('codProdutoFornecedorUp').value)
        const idProduto = Number(document.getElementById('idProdutoUp').value)
        const idFornecedor = Number(document.getElementById('idFornecedorUp').value)
        const custoUnitarioAtual = Number(document.getElementById('custoUnitarioAtualUp').value)
        const codigoReferencia = document.getElementById('codigoReferenciaUp').value

        const valores = {
            idProduto,
            idFornecedor,
            custoUnitarioAtual,
            codigoReferencia
        }

        console.log(valores)

        fetch(`http://localhost:3000/produto-fornecedor/${codProdutoFornecedor}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(valores)
        })
            .then(resp => resp.json())
            .then(dados => {
                console.log(dados)

                resAtualizar.innerHTML = `Relação produto-fornecedor atualizada: <br>
                            código: ${dados.produtoFornecedor.codProdutoFornecedor} <br>
                            ID do produto: ${dados.produtoFornecedor.idProduto} <br>
                            ID do fornecedor: ${dados.produtoFornecedor.idFornecedor} <br>
                            custo unitário: R$ ${dados.produtoFornecedor.custoUnitarioAtual} <br>
                            código referência: ${dados.produtoFornecedor.codigoReferencia || '-'} <br>
                            mensagem: ${dados.mensagem} <hr>`
            })
            .catch((err) => {
                console.error('Erro ao atualizar', err)
            })
    })

    atualizarParcial.addEventListener('click', () => {
        const codProdutoFornecedor = Number(document.getElementById('codProdutoFornecedorPatch').value)
        const custoUnitarioAtual = document.getElementById('custoUnitarioAtualPatch').value ? Number(document.getElementById('custoUnitarioAtualPatch').value) : null
        const codigoReferencia = document.getElementById('codigoReferenciaPatch').value

        const valores = {}
        if (custoUnitarioAtual !== null) valores.custoUnitarioAtual = custoUnitarioAtual
        if (codigoReferencia) valores.codigoReferencia = codigoReferencia

        console.log(valores)

        fetch(`http://localhost:3000/produto-fornecedor/${codProdutoFornecedor}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(valores)
        })
            .then(resp => resp.json())
            .then(dados => {
                console.log(dados)

                resAtualizarParcial.innerHTML = `Relação produto-fornecedor atualizada parcialmente: <br>
                            código: ${dados.produtoFornecedor.codProdutoFornecedor} <br>
                            custo unitário: ${dados.produtoFornecedor.custoUnitarioAtual ? 'R$ ' + dados.produtoFornecedor.custoUnitarioAtual : '-'} <br>
                            código referência: ${dados.produtoFornecedor.codigoReferencia || '-'} <br>
                            mensagem: ${dados.mensagem} <hr>`
            })
            .catch((err) => {
                console.error('Erro ao atualizar parcial', err)
            })
    })

    apagar.addEventListener('click', () => {
        const codProdutoFornecedor = Number(document.getElementById('codProdutoFornecedorDel').value)

        fetch(`http://localhost:3000/produto-fornecedor/${codProdutoFornecedor}`, {
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
                    <th>ID Produto</th>
                    <th>ID Fornecedor</th>
                    <th>Custo Unitário</th>
                    <th>Código Referência</th>
               </thead>`
    tab += `<tbody>`
    dados.forEach(dad => {
        tab += `<tr>
                    <td>${dad.codProdutoFornecedor}</td>
                    <td>${dad.idProduto}</td>
                    <td>${dad.idFornecedor}</td>
                    <td>${dad.custoUnitarioAtual ? 'R$ ' + dad.custoUnitarioAtual : '-'}</td>
                    <td>${dad.codigoReferencia || '-'}</td>
                </tr>`
    })
    tab += `</tbody>`
    return tab
}