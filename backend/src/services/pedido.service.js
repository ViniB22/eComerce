const Pedido = require('../models/Pedido')

async function criarPedido(dados) {

    const { idUsuario, idEndereco, valorSubtotal, valorFrete, valorTotal, metodoPagamento } = dados

    // Validações simples antes de salvar
    if (!idUsuario) {
        throw new Error('ID do usuário é obrigatório')
    }

    const novoPedido = await Pedido.create({
        idUsuario,
        idEndereco,
        valorSubtotal,
        valorFrete,
        valorTotal,
        metodoPagamento
    })

    return novoPedido
}

async function listarPedidos() {
    const pedidos = await Pedido.findAll()
    return pedidos
}

async function atualizarPedido(id, dados) {

    // Buscar o pedido no banco
    const pedido = await Pedido.findByPk(id)

    if (!pedido) {
        throw new Error('Pedido não encontrado')
    }

    // Atualizar apenas os campos enviados
    await pedido.update(dados)

    return pedido

}

async function atualizarPedidoCompleto(id, dados) {

    const pedido = await Pedido.findByPk(id)

    if (!pedido) {
        throw new Error('Pedido não encontrado')
    }

    const { idUsuario, idEndereco, valorSubtotal, valorFrete, valorTotal, metodoPagamento } = dados

    // Validações básicas
    if (!idUsuario) {
        throw new Error('ID do usuário é obrigatório')
    }

    await pedido.update({
        idUsuario,
        idEndereco,
        valorSubtotal,
        valorFrete,
        valorTotal,
        metodoPagamento
    })

    return pedido
}

async function apagarPedido(id) {

    const pedido = await Pedido.findByPk(id)

    if (!pedido) {
        throw new Error('Pedido não encontrado')
    }

    await pedido.destroy()

    return true
}


module.exports = { criarPedido, listarPedidos, 
    atualizarPedido, atualizarPedidoCompleto, apagarPedido }