const { criarEstoque, listarEstoques, 
    atualizarEstoque, atualizarEstoqueCompleto, apagarEstoque } = require('../services/estoque.service.js')

async function criar(req, res) {

    try {

        const estoque = await criarEstoque(req.body)

        return res.status(201).json({
            mensagem: 'Estoque criado com sucesso',
            estoque
        })

    } catch (err) {
        return res.status(500).json({ erro: err.message })
    }
}

async function listar(req, res) {
    try {
        const estoques = await listarEstoques()

        return res.status(200).json(estoques)

    } catch (err) {
        return res.status(500).json({ erro: err.message })
    }
}

// Atualizar parcialmente estoque (PATCH /estoque/)
async function atualizar(req, res) {
    try {
        const { id } = req.params
        const dados = req.body

        const estoqueAtualizado = await atualizarEstoque(id, dados)

        return res.status(200).json({
            mensagem: 'Estoque atualizado com sucesso',
            estoque: estoqueAtualizado
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

        const estoqueAtualizado = await atualizarEstoqueCompleto(id, dados)

        return res.status(200).json({
            mensagem: 'Estoque atualizado completamente com sucesso',
            estoque: estoqueAtualizado
        })

    } catch (err) {
        return res.status(500).json({ erro: err.message })
    }
}

// DELETE - apagar
async function deletar(req, res) {
    try {
        const { id } = req.params

        await apagarEstoque(id)

        return res.status(200).json({ mensagem: 'Estoque apagado com sucesso' })

    } catch (err) {
        return res.status(500).json({ erro: err.message })
    }
}


module.exports = { criar, listar, atualizar, 
    atualizarCompleto, deletar }