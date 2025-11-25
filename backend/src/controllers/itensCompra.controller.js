const { criarItemCompra, listarItensCompra, 
    atualizarItemCompra, atualizarItemCompraCompleto, apagarItemCompra } = require('../services/itensCompra.service.js')

async function criar(req, res) {

    try {

        const itemCompra = await criarItemCompra(req.body)

        return res.status(201).json({
            mensagem: 'Item da compra criado com sucesso',
            itemCompra
        })

    } catch (err) {
        return res.status(500).json({ erro: err.message })
    }
}

async function listar(req, res) {
    try {
        const itensCompra = await listarItensCompra()

        return res.status(200).json(itensCompra)

    } catch (err) {
        return res.status(500).json({ erro: err.message })
    }
}

// Atualizar parcialmente itemCompra (PATCH /itensCompra/)
async function atualizar(req, res) {
    try {
        const { id } = req.params
        const dados = req.body

        const itemCompraAtualizado = await atualizarItemCompra(id, dados)

        return res.status(200).json({
            mensagem: 'Item da compra atualizado com sucesso',
            itemCompra: itemCompraAtualizado
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

        const itemCompraAtualizado = await atualizarItemCompraCompleto(id, dados)

        return res.status(200).json({
            mensagem: 'Item da compra atualizado completamente com sucesso',
            itemCompra: itemCompraAtualizado
        })

    } catch (err) {
        return res.status(500).json({ erro: err.message })
    }
}

// DELETE - apagar
async function deletar(req, res) {
    try {
        const { id } = req.params

        await apagarItemCompra(id)

        return res.status(200).json({ mensagem: 'Item da compra apagado com sucesso' })

    } catch (err) {
        return res.status(500).json({ erro: err.message })
    }
}


module.exports = { criar, listar, atualizar, 
    atualizarCompleto, deletar }