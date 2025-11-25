const Entrega = require('../models/Entrega')

async function criarEntrega(dados) {

    const { idPedido, dataEstimada, dataEntrega, codigoRastreio, transportadora, statusEntrega } = dados

    // Validações simples antes de salvar
    if (!idPedido) {
        throw new Error('ID do pedido é obrigatório')
    }

    const novaEntrega = await Entrega.create({
        idPedido,
        dataEstimada,
        dataEntrega,
        codigoRastreio,
        transportadora,
        statusEntrega
    })

    return novaEntrega
}

async function listarEntregas() {
    const entregas = await Entrega.findAll()
    return entregas
}

async function atualizarEntrega(id, dados) {

    // Buscar a entrega no banco
    const entrega = await Entrega.findByPk(id)

    if (!entrega) {
        throw new Error('Entrega não encontrada')
    }

    // Atualizar apenas os campos enviados
    await entrega.update(dados)

    return entrega

}

async function atualizarEntregaCompleto(id, dados) {

    const entrega = await Entrega.findByPk(id)

    if (!entrega) {
        throw new Error('Entrega não encontrada')
    }

    const { idPedido, dataEstimada, dataEntrega, codigoRastreio, transportadora, statusEntrega } = dados

    // Validações básicas
    if (!idPedido) {
        throw new Error('ID do pedido é obrigatório')
    }

    await entrega.update({
        idPedido,
        dataEstimada,
        dataEntrega,
        codigoRastreio,
        transportadora,
        statusEntrega
    })

    return entrega
}

async function apagarEntrega(id) {

    const entrega = await Entrega.findByPk(id)

    if (!entrega) {
        throw new Error('Entrega não encontrada')
    }

    await entrega.destroy()

    return true
}


module.exports = { criarEntrega, listarEntregas, 
    atualizarEntrega, atualizarEntregaCompleto, apagarEntrega }