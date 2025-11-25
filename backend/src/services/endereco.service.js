const Endereco = require('../models/Endereco')

async function criarEndereco(dados) {

    const { idUsuario, cep, logradouro, complemento, bairro, localidade, uf, numero, apelido, is_principal } = dados

    // Validações simples antes de salvar
    if (!idUsuario || !cep || !logradouro || !bairro || !localidade || !uf || !numero) {
        throw new Error('ID do usuário, CEP, logradouro, bairro, localidade, UF e número são obrigatórios')
    }

    const novoEndereco = await Endereco.create({
        idUsuario,
        cep,
        logradouro,
        complemento,
        bairro,
        localidade,
        uf,
        numero,
        apelido,
        is_principal
    })

    return novoEndereco
}

async function listarEnderecos() {
    const enderecos = await Endereco.findAll()
    return enderecos
}

async function atualizarEndereco(id, dados) {

    // Buscar o endereco no banco
    const endereco = await Endereco.findByPk(id)

    if (!endereco) {
        throw new Error('Endereço não encontrado')
    }

    // Atualizar apenas os campos enviados
    await endereco.update(dados)

    return endereco

}

async function atualizarEnderecoCompleto(id, dados) {

    const endereco = await Endereco.findByPk(id)

    if (!endereco) {
        throw new Error('Endereço não encontrado')
    }

    const { idUsuario, cep, logradouro, complemento, bairro, localidade, uf, numero, apelido, is_principal } = dados

    // Validações básicas
    if (!idUsuario || !cep || !logradouro || !bairro || !localidade || !uf || !numero) {
        throw new Error('ID do usuário, CEP, logradouro, bairro, localidade, UF e número são obrigatórios')
    }

    await endereco.update({
        idUsuario,
        cep,
        logradouro,
        complemento,
        bairro,
        localidade,
        uf,
        numero,
        apelido,
        is_principal
    })

    return endereco
}

async function apagarEndereco(id) {

    const endereco = await Endereco.findByPk(id)

    if (!endereco) {
        throw new Error('Endereço não encontrado')
    }

    await endereco.destroy()

    return true
}


module.exports = { criarEndereco, listarEnderecos, 
    atualizarEndereco, atualizarEnderecoCompleto, apagarEndereco }