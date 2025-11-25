const Estoque = require('../models/Estoque')

async function criarEstoque(dados) {

    const { idProduto, quantidade_atual, quantidade_minima } = dados

    // Validações simples antes de salvar
    if (!idProduto) {
        throw new Error('ID do produto é obrigatório')
    }

    const novoEstoque = await Estoque.create({
        idProduto,
        quantidade_atual,
        quantidade_minima
    })

    return novoEstoque
}

async function listarEstoques() {
    const estoques = await Estoque.findAll()
    return estoques
}

async function atualizarEstoque(id, dados) {

    // Buscar o estoque no banco
    const estoque = await Estoque.findByPk(id)

    if (!estoque) {
        throw new Error('Estoque não encontrado')
    }

    // Atualizar apenas os campos enviados
    await estoque.update(dados)

    return estoque

}

async function atualizarEstoqueCompleto(id, dados) {

    const estoque = await Estoque.findByPk(id)

    if (!estoque) {
        throw new Error('Estoque não encontrado')
    }

    const { idProduto, quantidade_atual, quantidade_minima } = dados

    // Validações básicas
    if (!idProduto) {
        throw new Error('ID do produto é obrigatório')
    }

    await estoque.update({
        idProduto,
        quantidade_atual,
        quantidade_minima
    })

    return estoque
}

async function apagarEstoque(id) {

    const estoque = await Estoque.findByPk(id)

    if (!estoque) {
        throw new Error('Estoque não encontrado')
    }

    await estoque.destroy()

    return true
}


module.exports = { criarEstoque, listarEstoques, 
    atualizarEstoque, atualizarEstoqueCompleto, apagarEstoque }