const Fornecedor = require('../models/Fornecedor')

async function criarFornecedor(dados) {

    const { nomeEmpresa, cnpj, email, telefone } = dados

    // Validações simples antes de salvar
    if (!nomeEmpresa || !cnpj) {
        throw new Error('Nome da empresa e CNPJ são obrigatórios')
    }

    const novoFornecedor = await Fornecedor.create({
        nomeEmpresa,
        cnpj,
        email,
        telefone
    })

    return novoFornecedor
}

async function listarFornecedores() {
    const fornecedores = await Fornecedor.findAll()
    return fornecedores
}

async function atualizarFornecedor(id, dados) {

    // Buscar o fornecedor no banco
    const fornecedor = await Fornecedor.findByPk(id)

    if (!fornecedor) {
        throw new Error('Fornecedor não encontrado')
    }

    // Atualizar apenas os campos enviados
    await fornecedor.update(dados)

    return fornecedor

}

async function atualizarFornecedorCompleto(id, dados) {

    const fornecedor = await Fornecedor.findByPk(id)

    if (!fornecedor) {
        throw new Error('Fornecedor não encontrado')
    }

    const { nomeEmpresa, cnpj, email, telefone } = dados

    // Validações básicas
    if (!nomeEmpresa || !cnpj) {
        throw new Error('Nome da empresa e CNPJ são obrigatórios')
    }

    await fornecedor.update({
        nomeEmpresa,
        cnpj,
        email,
        telefone
    })

    return fornecedor
}

async function apagarFornecedor(id) {

    const fornecedor = await Fornecedor.findByPk(id)

    if (!fornecedor) {
        throw new Error('Fornecedor não encontrado')
    }

    await fornecedor.destroy()

    return true
}


module.exports = { criarFornecedor, listarFornecedores, 
    atualizarFornecedor, atualizarFornecedorCompleto, apagarFornecedor }