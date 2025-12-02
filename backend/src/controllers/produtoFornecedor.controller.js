const { criarProdutoFornecedor, listarProdutosFornecedor, 
    atualizarProdutoFornecedor, atualizarProdutoFornecedorCompleto, apagarProdutoFornecedor } = require('../services/produtoFornecedor.service.js')

async function criar(req, res) {

    try {

        const produtoFornecedor = await criarProdutoFornecedor(req.body)

        return res.status(201).json({
            message: 'Relação produto-fornecedor criada com sucesso',
            produtoFornecedor
        })

    } catch (err) {
        return res.status(500).json({ erro: err.message })
    }
}

async function listar(req, res) {
    try {
        const produtosFornecedor = await listarProdutosFornecedor()

        return res.status(200).json(produtosFornecedor)

    } catch (err) {
        return res.status(500).json({ erro: err.message })
    }
}

// Atualizar parcialmente produtoFornecedor (PATCH /produtoFornecedor/)
async function atualizar(req, res) {
    try {
        const { id } = req.params
        const dados = req.body

        const produtoFornecedorAtualizado = await atualizarProdutoFornecedor(id, dados)

        return res.status(200).json({
            message: 'Relação produto-fornecedor atualizada com sucesso',
            produtoFornecedor: produtoFornecedorAtualizado
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

        const produtoFornecedorAtualizado = await atualizarProdutoFornecedorCompleto(id, dados)

        return res.status(200).json({
            message: 'Relação produto-fornecedor atualizada completamente com sucesso',
            produtoFornecedor: produtoFornecedorAtualizado
        })

    } catch (err) {
        return res.status(500).json({ erro: err.message })
    }
}

// DELETE - apagar
async function deletar(req, res) {
    try {
        const { id } = req.params

        await apagarProdutoFornecedor(id)

        return res.status(200).json({ message: 'Relação produto-fornecedor apagada com sucesso' })

    } catch (err) {
        return res.status(500).json({ erro: err.message })
    }
}


module.exports = { criar, listar, atualizar, 
    atualizarCompleto, deletar }