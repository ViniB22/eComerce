const { criarPedido, listarPedidos, 
    atualizarPedido, atualizarPedidoCompleto, apagarPedido } = require('../services/pedido.service.js')

async function criar(req, res) {

    try {

        const pedido = await criarPedido(req.body)

        return res.status(201).json({
            mensagem: 'Pedido criado com sucesso',
            pedido
        })

    } catch (err) {
        return res.status(500).json({ erro: err.message })
    }
}

async function listar(req, res) {
    try {
        const pedidos = await listarPedidos()

        return res.status(200).json(pedidos)

    } catch (err) {
        return res.status(500).json({ erro: err.message })
    }
}

// Atualizar parcialmente pedido (PATCH /pedido/)
async function atualizar(req, res) {
    try {
        const { id } = req.params
        const dados = req.body

        const pedidoAtualizado = await atualizarPedido(id, dados)

        return res.status(200).json({
            mensagem: 'Pedido atualizado com sucesso',
            pedido: pedidoAtualizado
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

        const pedidoAtualizado = await atualizarPedidoCompleto(id, dados)

        return res.status(200).json({
            mensagem: 'Pedido atualizado completamente com sucesso',
            pedido: pedidoAtualizado
        })

    } catch (err) {
        return res.status(500).json({ erro: err.message })
    }
}

// DELETE - apagar
async function deletar(req, res) {
    try {
        const { id } = req.params

        await apagarPedido(id)

        return res.status(200).json({ mensagem: 'Pedido apagado com sucesso' })

    } catch (err) {
        return res.status(500).json({ erro: err.message })
    }
}


module.exports = { criar, listar, atualizar, 
    atualizarCompleto, deletar }