const Pagamento = require('../models/Pagamento')

async function criarPagamento(dados) {

    const { idPedido, idCompra, valor, metodo, status } = dados

    // Validações simples antes de salvar
    if (!valor || !metodo) {
        throw new Error('Valor e método são obrigatórios')
    }

    const novoPagamento = await Pagamento.create({
        idPedido,
        idCompra,
        valor,
        metodo,
        status
    })

    return novoPagamento
}

async function listarPagamentos() {
    const pagamentos = await Pagamento.findAll()
    return pagamentos
}

async function atualizarPagamento(id, dados) {

    // Buscar o pagamento no banco
    const pagamento = await Pagamento.findByPk(id)

    if (!pagamento) {
        throw new Error('Pagamento não encontrado')
    }

    // Atualizar apenas os campos enviados
    await pagamento.update(dados)

    return pagamento

}

async function atualizarPagamentoCompleto(id, dados) {

    const pagamento = await Pagamento.findByPk(id)

    if (!pagamento) {
        throw new Error('Pagamento não encontrado')
    }

    const { idPedido, idCompra, valor, metodo, status } = dados

    // Validações básicas
    if (!valor || !metodo) {
        throw new Error('Valor e método são obrigatórios')
    }

    await pagamento.update({
        idPedido,
        idCompra,
        valor,
        metodo,
        status
    })

    return pagamento
}

async function apagarPagamento(id) {

    const pagamento = await Pagamento.findByPk(id)

    if (!pagamento) {
        throw new Error('Pagamento não encontrado')
    }

    await pagamento.destroy()

    return true
}


module.exports = { criarPagamento, listarPagamentos, 
    atualizarPagamento, atualizarPagamentoCompleto, apagarPagamento }