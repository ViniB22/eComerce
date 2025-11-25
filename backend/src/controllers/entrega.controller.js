const { criarEntrega, listarEntregas, 
    atualizarEntrega, atualizarEntregaCompleto, apagarEntrega } = require('../services/entrega.service.js')

async function criar(req, res) {

    try {

        const entrega = await criarEntrega(req.body)

        return res.status(201).json({
            mensagem: 'Entrega criada com sucesso',
            entrega
        })

    } catch (err) {
        return res.status(500).json({ erro: err.message })
    }
}

async function listar(req, res) {
    try {
        const entregas = await listarEntregas()

        return res.status(200).json(entregas)

    } catch (err) {
        return res.status(500).json({ erro: err.message })
    }
}

// Atualizar parcialmente entrega (PATCH /entrega/)
async function atualizar(req, res) {
    try {
        const { id } = req.params
        const dados = req.body

        const entregaAtualizada = await atualizarEntrega(id, dados)

        return res.status(200).json({
            mensagem: 'Entrega atualizada com sucesso',
            entrega: entregaAtualizada
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

        const entregaAtualizada = await atualizarEntregaCompleto(id, dados)

        return res.status(200).json({
            mensagem: 'Entrega atualizada completamente com sucesso',
            entrega: entregaAtualizada
        })

    } catch (err) {
        return res.status(500).json({ erro: err.message })
    }
}

// DELETE - apagar
async function deletar(req, res) {
    try {
        const { id } = req.params

        await apagarEntrega(id)

        return res.status(200).json({ mensagem: 'Entrega apagada com sucesso' })

    } catch (err) {
        return res.status(500).json({ erro: err.message })
    }
}


module.exports = { criar, listar, atualizar, 
    atualizarCompleto, deletar }