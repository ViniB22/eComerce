const { criarFornecedor, listarFornecedores, 
    atualizarFornecedor, atualizarFornecedorCompleto, apagarFornecedor } = require('../services/fornecedor.service.js')

async function criar(req, res) {

    try {

        const fornecedor = await criarFornecedor(req.body)

        return res.status(201).json({
            message: 'Fornecedor criado com sucesso',
            fornecedor
        })

    } catch (err) {
        return res.status(500).json({ erro: err.message })
    }
}

async function listar(req, res) {
    try {
        const fornecedores = await listarFornecedores()

        return res.status(200).json(fornecedores)

    } catch (err) {
        return res.status(500).json({ erro: err.message })
    }
}

// Atualizar parcialmente fornecedor (PATCH /fornecedor/)
async function atualizar(req, res) {
    try {
        const { id } = req.params
        const dados = req.body

        const fornecedorAtualizado = await atualizarFornecedor(id, dados)

        return res.status(200).json({
            message: 'Fornecedor atualizado com sucesso',
            fornecedor: fornecedorAtualizado
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

        const fornecedorAtualizado = await atualizarFornecedorCompleto(id, dados)

        return res.status(200).json({
            message: 'Fornecedor atualizado completamente com sucesso',
            fornecedor: fornecedorAtualizado
        })

    } catch (err) {
        return res.status(500).json({ erro: err.message })
    }
}

// DELETE - apagar
async function deletar(req, res) {
    try {
        const { id } = req.params

        await apagarFornecedor(id)

        return res.status(200).json({ message: 'Fornecedor apagado com sucesso' })

    } catch (err) {
        return res.status(500).json({ erro: err.message })
    }
}


module.exports = { criar, listar, atualizar, 
    atualizarCompleto, deletar }