const CategoriaProduto = require('../models/CategoriaProduto')

async function criarCategoriaProduto(dados) {

    const { nome, descricao  } = dados

    // Validações simples antes de salvar
    if (!nome) {
        throw new Error('Nome é obrigatórios')
    }

    const novoCategoria = await CategoriaProduto.create({
        nome,
        descricao,
        is_ativo
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

    return CategoriaProduto

}

async function atualizarCategoriaProdutoCompleto(id, dados) {

    const categoria = await CategoriaProduto.findByPk(id)

    if (!categoria) {
        throw new Error('categoria não encontrado')
    }

    const { nome, descricao, is_ativo } = dados

    // Validações básicas
    if (!nome ) {
        throw new Error('Nome é obrigatórios')
    }

    await categoria.update({
        nome,
        descricao,
        is_ativo
    })

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
