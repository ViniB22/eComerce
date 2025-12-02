const { criarCategoriaProduto, listarCategoriaProdutos, 
    atualizarCategoriaProduto, atualizarCategoriaProdutoCompleto, apagarCategoriaProduto } = require('../services/categoria.service')

async function criar(req, res) {

    try {

        const categoria = await criarCategoriaProduto(req.body)

        return res.status(201).json({
            message: 'Categoria criada com sucesso',
            categoria
        })

    } catch (err) {
        return res.status(500).json({ erro: err.message })
    }
}

async function listar(req, res) {
    try {
        const categoria = await listarCategoriaProdutos()

        return res.status(200).json(categoria)

    } catch (err) {
        return res.status(500).json({ erro: err.message })
    }
}

// Atualizar parcialmente produto (PATCH /produto/)
async function atualizar(req, res) {
    try {
        const { id } = req.params
        const dados = req.body

        const categoriaAtualizada = await atualizarCategoriaProduto(id, dados)

        return res.status(200).json({
            message: 'Categoria atualizada com sucesso',
            categoria: categoriaAtualizada
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

        const categoriaAtualizada = await atualizarCategoriaProdutoCompleto(id, dados)

        return res.status(200).json({
            message: 'Categoria atualizada completamente com sucesso',
            categoria: categoriaAtualizada
        })

    } catch (err) {
        return res.status(500).json({ erro: err.message })
    }
}

// DELETE - apagar
async function deletar(req, res) {
    try {
        const { id } = req.params

        await apagarCategoriaProduto(id)

        return res.status(200).json({ message: 'Categoria apagada com sucesso' })

    } catch (err) {
        return res.status(500).json({ erro: err.message })
    }
}


module.exports = { criar, listar, atualizar, 
    atualizarCompleto, deletar }
