const { criarCompra, listarCompras, 
    atualizarCompra, atualizarCompraCompleto, apagarCompra } = require('../services/compra.service.js')

async function criar(req, res) {

    try {

        const compra = await criarCompra(req.body)

        return res.status(201).json({
            mensagem: 'Compra criada com sucesso',
            compra
        })

    } catch (err) {
        return res.status(500).json({ erro: err.message })
    }
}

async function listar(req, res) {
    try {
        const compras = await listarCompras()

        return res.status(200).json(compras)

    } catch (err) {
        return res.status(500).json({ erro: err.message })
    }
}

// Atualizar parcialmente compra (PATCH /compra/)
async function atualizar(req, res) {
    try {
        const { id } = req.params
        const dados = req.body

        const compraAtualizada = await atualizarCompra(id, dados)

        return res.status(200).json({
            mensagem: 'Compra atualizada com sucesso',
            compra: compraAtualizada
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

        const compraAtualizada = await atualizarCompraCompleto(id, dados)

        return res.status(200).json({
            mensagem: 'Compra atualizada completamente com sucesso',
            compra: compraAtualizada
        })

    } catch (err) {
        return res.status(500).json({ erro: err.message })
    }
}

// DELETE - apagar
async function deletar(req, res) {
    try {
        const { id } = req.params

        await apagarCompra(id)

        return res.status(200).json({ mensagem: 'Compra apagada com sucesso' })

    } catch (err) {
        return res.status(500).json({ erro: err.message })
    }
}


module.exports = { criar, listar, atualizar, 
    atualizarCompleto, deletar }