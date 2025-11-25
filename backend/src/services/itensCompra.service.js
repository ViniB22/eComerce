const ItensCompra = require('../models/ItensCompra')

async function criarItemCompra(dados) {

    const { idCompra, idProduto, quantidade, custoUnitario } = dados

    // Validações simples antes de salvar
    if (!idCompra || !idProduto || !quantidade || !custoUnitario) {
        throw new Error('ID da compra, ID do produto, quantidade e custo unitário são obrigatórios')
    }

    const novoItemCompra = await ItensCompra.create({
        idCompra,
        idProduto,
        quantidade,
        custoUnitario
    })

    return novoItemCompra
}

async function listarItensCompra() {
    const itensCompra = await ItensCompra.findAll()
    return itensCompra
}

async function atualizarItemCompra(id, dados) {

    // Buscar o itemCompra no banco
    const itemCompra = await ItensCompra.findByPk(id)

    if (!itemCompra) {
        throw new Error('Item da compra não encontrado')
    }

    // Atualizar apenas os campos enviados
    await itemCompra.update(dados)

    return itemCompra

}

async function atualizarItemCompraCompleto(id, dados) {

    const itemCompra = await ItensCompra.findByPk(id)

    if (!itemCompra) {
        throw new Error('Item da compra não encontrado')
    }

    const { idCompra, idProduto, quantidade, custoUnitario } = dados

    // Validações básicas
    if (!idCompra || !idProduto || !quantidade || !custoUnitario) {
        throw new Error('ID da compra, ID do produto, quantidade e custo unitário são obrigatórios')
    }

    await itemCompra.update({
        idCompra,
        idProduto,
        quantidade,
        custoUnitario
    })

    return itemCompra
}

async function apagarItemCompra(id) {

    const itemCompra = await ItensCompra.findByPk(id)

    if (!itemCompra) {
        throw new Error('Item da compra não encontrado')
    }

    await itemCompra.destroy()

    return true
}


module.exports = { criarItemCompra, listarItensCompra, 
    atualizarItemCompra, atualizarItemCompraCompleto, apagarItemCompra }