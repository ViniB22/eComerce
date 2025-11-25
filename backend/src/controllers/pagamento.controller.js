const { criarPagamento, listarPagamentos, 
    atualizarPagamento, atualizarPagamentoCompleto, apagarPagamento } = require('../services/pagamento.service.js')

async function criar(req, res) {

    try {

        const pagamento = await criarPagamento(req.body)

        return res.status(201).json({
            mensagem: 'Pagamento criado com sucesso',
            pagamento
        })

    } catch (err) {
        return res.status(500).json({ erro: err.message })
    }
}

async function listar(req, res) {
    try {
        const pagamentos = await listarPagamentos()

        return res.status(200).json(pagamentos)

    } catch (err) {
        return res.status(500).json({ erro: err.message })
    }
}

// Atualizar parcialmente pagamento (PATCH /pagamento/)
async function atualizar(req, res) {
    try {
        const { id } = req.params
        const dados = req.body

        const pagamentoAtualizado = await atualizarPagamento(id, dados)

        return res.status(200).json({
            mensagem: 'Pagamento atualizado com sucesso',
            pagamento: pagamentoAtualizado
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

        const pagamentoAtualizado = await atualizarPagamentoCompleto(id, dados)

        return res.status(200).json({
            mensagem: 'Pagamento atualizado completamente com sucesso',
            pagamento: pagamentoAtualizado
        })

    } catch (err) {
        return res.status(500).json({ erro: err.message })
    }
}

// DELETE - apagar
async function deletar(req, res) {
    try {
        const { id } = req.params

        await apagarPagamento(id)

        return res.status(200).json({ mensagem: 'Pagamento apagado com sucesso' })

    } catch (err) {
        return res.status(500).json({ erro: err.message })
    }
}


module.exports = { criar, listar, atualizar, 
    atualizarCompleto, deletar }