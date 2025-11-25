const { criarEndereco, listarEnderecos, 
    atualizarEndereco, atualizarEnderecoCompleto, apagarEndereco } = require('../services/endereco.service.js')

async function criar(req, res) {

    try {

        const endereco = await criarEndereco(req.body)

        return res.status(201).json({
            mensagem: 'Endereço criado com sucesso',
            endereco
        })

    } catch (err) {
        return res.status(500).json({ erro: err.message })
    }
}

async function listar(req, res) {
    try {
        const enderecos = await listarEnderecos()

        return res.status(200).json(enderecos)

    } catch (err) {
        return res.status(500).json({ erro: err.message })
    }
}

// Atualizar parcialmente endereco (PATCH /endereco/)
async function atualizar(req, res) {
    try {
        const { id } = req.params
        const dados = req.body

        const enderecoAtualizado = await atualizarEndereco(id, dados)

        return res.status(200).json({
            mensagem: 'Endereço atualizado com sucesso',
            endereco: enderecoAtualizado
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

        const enderecoAtualizado = await atualizarEnderecoCompleto(id, dados)

        return res.status(200).json({
            mensagem: 'Endereço atualizado completamente com sucesso',
            endereco: enderecoAtualizado
        })

    } catch (err) {
        return res.status(500).json({ erro: err.message })
    }
}

// DELETE - apagar
async function deletar(req, res) {
    try {
        const { id } = req.params

        await apagarEndereco(id)

        return res.status(200).json({ mensagem: 'Endereço apagado com sucesso' })

    } catch (err) {
        return res.status(500).json({ erro: err.message })
    }
}


module.exports = { criar, listar, atualizar, 
    atualizarCompleto, deletar }