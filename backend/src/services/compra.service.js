const Compra = require('../models/Compra')

async function criarCompra(dados) {

    const { referenciaFornecedor, numeroDocumento, valorTotal, statusCompra } = dados

    // Validações simples antes de salvar
    if (!referenciaFornecedor) {
        throw new Error('Referência do fornecedor é obrigatória')
    }

    const novaCompra = await Compra.create({
        referenciaFornecedor,
        numeroDocumento,
        valorTotal,
        statusCompra
    })

    return novaCompra
}

async function listarCompras() {
    const compras = await Compra.findAll()
    return compras
}

async function atualizarCompra(id, dados) {

    // Buscar a compra no banco
    const compra = await Compra.findByPk(id)

    if (!compra) {
        throw new Error('Compra não encontrada')
    }

    // Atualizar apenas os campos enviados
    await compra.update(dados)

    return compra

}

async function atualizarCompraCompleto(id, dados) {

    const compra = await Compra.findByPk(id)

    if (!compra) {
        throw new Error('Compra não encontrada')
    }

    const { referenciaFornecedor, numeroDocumento, valorTotal, statusCompra } = dados

    // Validações básicas
    if (!referenciaFornecedor) {
        throw new Error('Referência do fornecedor é obrigatória')
    }

    await compra.update({
        referenciaFornecedor,
        numeroDocumento,
        valorTotal,
        statusCompra
    })

    return compra
}

async function apagarCompra(id) {

    const compra = await Compra.findByPk(id)

    if (!compra) {
        throw new Error('Compra não encontrada')
    }

    await compra.destroy()

    return true
}


module.exports = { criarCompra, listarCompras, 
    atualizarCompra, atualizarCompraCompleto, apagarCompra }