const CategoriaProduto = require('../models/CategoriaProduto')

async function criarCategoriaProduto(dados) {

    const { nome, descricao  } = dados

    // Validações simples antes de salvar
    if (!nome) {
        throw new Error('Nome é obrigatório')
    }

    const novoCategoria = await CategoriaProduto.create({
        nome,
        descricao
    })

    return novoCategoria
}

async function listarCategoriaProdutos() {
    const categoria = await CategoriaProduto.findAll()
    return categoria
}

async function atualizarCategoriaProduto(id, dados) {

    // Buscar o CategoriaProduto no banco
    const categoria = await CategoriaProduto.findByPk(id)

    if (!categoria) {
        throw new Error('categoria não encontrado')
    }

    // Atualizar apenas os campos enviados
    await categoria.update(dados)

    return categoria

}

async function atualizarCategoriaProdutoCompleto(id, dados) {

    const categoria = await CategoriaProduto.findByPk(id)

    if (!categoria) {
        throw new Error('categoria não encontrado')
    }

    const { nome, descricao, is_ativo } = dados

    // Validações básicas
    if (!nome ) {
        throw new Error('Nome é obrigatório')
    }

    const updateData = { nome, descricao }
    if (is_ativo !== undefined) {
        updateData.is_ativo = is_ativo
    }

    await categoria.update(updateData)

    return categoria
}

async function apagarCategoriaProduto(id) {

    const categoria = await CategoriaProduto.findByPk(id)

    if (!categoria) {
        throw new Error('categoria não encontrado')
    }

    await categoria.destroy()

    return true
}


module.exports = { criarCategoriaProduto, listarCategoriaProdutos, 
    atualizarCategoriaProduto, atualizarCategoriaProdutoCompleto, apagarCategoriaProduto }
