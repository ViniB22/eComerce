const ItemPedido = require('../models/ItemPedido')

async function criarItemPedido(dados) {

    const { idPedido, idProduto, quantidade, precoUnitario, valorTotalItem } = dados

    // Validações simples antes de salvar
    if (!idPedido || !idProduto || !quantidade || !precoUnitario) {
        throw new Error('ID do pedido, ID do produto, quantidade e preço unitário são obrigatórios')
    }

    const novoItemPedido = await ItemPedido.create({
        idPedido,
        idProduto,
        quantidade,
        precoUnitario,
        valorTotalItem
    })

    return novoItemPedido
}

async function listarItensPedido() {
    const itensPedido = await ItemPedido.findAll()
    return itensPedido
}

async function atualizarItemPedido(id, dados) {

    // Buscar o itemPedido no banco
    const itemPedido = await ItemPedido.findByPk(id)

    if (!itemPedido) {
        throw new Error('Item do pedido não encontrado')
    }

    // Atualizar apenas os campos enviados
    await itemPedido.update(dados)

    return itemPedido

}

async function atualizarItemPedidoCompleto(id, dados) {

    const itemPedido = await ItemPedido.findByPk(id)

    if (!itemPedido) {
        throw new Error('Item do pedido não encontrado')
    }

    const { idPedido, idProduto, quantidade, precoUnitario, valorTotalItem } = dados

    // Validações básicas
    if (!idPedido || !idProduto || !quantidade || !precoUnitario) {
        throw new Error('ID do pedido, ID do produto, quantidade e preço unitário são obrigatórios')
    }

    await itemPedido.update({
        idPedido,
        idProduto,
        quantidade,
        precoUnitario,
        valorTotalItem
    })

    return itemPedido
}

async function apagarItemPedido(id) {

    const itemPedido = await ItemPedido.findByPk(id)

    if (!itemPedido) {
        throw new Error('Item do pedido não encontrado')
    }

    await itemPedido.destroy()

    return true
}


module.exports = { criarItemPedido, listarItensPedido, 
    atualizarItemPedido, atualizarItemPedidoCompleto, apagarItemPedido }