const Produto = require('../models/Produto')
const Categoria = require('../models/CategoriaProduto')

async function criarProduto(dados) {

    const { nome, descricao, modelo, preco, imagem_url, ativo, idCategoria } = dados
    
    if (!nome || !modelo || !preco, !idCategoria) {
        throw new Error('Nome, modelo, preço e categoria são obrigatórios')
    }
    try {
        const categoria = await Categoria.findByPk(idCategoria)
        if (!categoria) {
            throw new Error('Categoria não encontrada')
        }

        const novoProduto = await Produto.create({
            nome,
            descricao,
            modelo,
            preco,
            imagem_url,
            idCategoria,
            ativo
        })

        return novoProduto

    } catch (err) {
        console.error('Erro ao verificar categoria:', err)
    }
}

async function listarProdutos() {
    const produtos = await Produto.findAll()
    return produtos
}

async function atualizarProduto(id, dados) {

    // Buscar o produto no banco
    const produto = await Produto.findByPk(id)

    if (!produto) {
        throw new Error('Produto não encontrado')
    }

    // Atualizar apenas os campos enviados
    await produto.update(dados)

    return produto

}

async function atualizarProdutoCompleto(id, dados) {

    const produto = await Produto.findByPk(id)

    if (!produto) {
        throw new Error('Produto não encontrado')
    }

    const { nome, descricao, modelo, preco, imagem_url, ativo, idCategoria } = dados

    // Validações básicas
    if (!nome || !modelo || !preco) {
        throw new Error('Nome, modelo e preço são obrigatórios')
    }

    const updateData = { nome, descricao, modelo, preco, imagem_url, idCategoria }
    if (ativo !== undefined) {
        updateData.ativo = ativo
    }

    await produto.update(updateData)

    return produto
}

async function apagarProduto(id) {

    const produto = await Produto.findByPk(id)

    if (!produto) {
        throw new Error('Produto não encontrado')
    }

    await produto.destroy()

    return true
}


module.exports = {
    criarProduto, listarProdutos,
    atualizarProduto, atualizarProdutoCompleto, apagarProduto
}
