const { criarItemPedido, listarItensPedido, 
    atualizarItemPedido, atualizarItemPedidoCompleto, apagarItemPedido } = require('../services/itemPedido.service.js')

async function criar(req, res) {

    try {

        const itemPedido = await criarItemPedido(req.body)

        return res.status(201).json({
            mensagem: 'Item do pedido criado com sucesso',
            itemPedido
        })

    } catch (err) {
        return res.status(500).json({ erro: err.message })
    }
}

async function listar(req, res) {
    try {
        const itensPedido = await listarItensPedido()

        return res.status(200).json(itensPedido)

    } catch (err) {
        return res.status(500).json({ erro: err.message })
    }
}

// Atualizar parcialmente itemPedido (PATCH /itemPedido/)
async function atualizar(req, res) {
    try {
        const { id } = req.params
        const dados = req.body

        const itemPedidoAtualizado = await atualizarItemPedido(id, dados)

        return res.status(200).json({
            mensagem: 'Item do pedido atualizado com sucesso',
            itemPedido: itemPedidoAtualizado
        })

    } catch (err) {
        return res.status(500).json({ erro: err.message })
    }

}

// PUT - Atualização total
async function atualizarCompleto(req, res) {
    try {
        const { id } = req.params
        const dados = req.body

        const itemPedidoAtualizado = await atualizarItemPedidoCompleto(id, dados)

        return res.status(200).json({
            mensagem: 'Item do pedido atualizado completamente com sucesso',
            itemPedido: itemPedidoAtualizado
        })

    } catch (err) {
        return res.status(500).json({ erro: err.message })
    }
}

// DELETE - apagar
async function deletar(req, res) {
    try {
        const { id } = req.params

        await apagarItemPedido(id)

        return res.status(200).json({ mensagem: 'Item do pedido apagado com sucesso' })

    } catch (err) {
        return res.status(500).json({ erro: err.message })
    }
}


module.exports = { criar, listar, atualizar, 
    atualizarCompleto, deletar }