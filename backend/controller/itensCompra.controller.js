// itensCompra.controller.js
const ItensCompra = require('../models/ItensCompra')
const Compra = require('../models/Compra')
const Produto = require('../models/Produto')
const Fornecedor = require('../models/Fornecedor')

const adicionarItemCompra = async (req, res) => {
    const { idCompra, idProduto, quantidade, custoUnitario } = req.body
    
    if (!idCompra || !idProduto || !quantidade || !custoUnitario) {
        return res.status(400).json({message: "Todos os campos são obrigatórios"})
    }

    if (quantidade <= 0) {
        return res.status(400).json({message: "Quantidade deve ser maior que zero"})
    }

    if (custoUnitario <= 0) {
        return res.status(400).json({message: "Custo unitário deve ser maior que zero"})
    }

    try {
        // Verificar se compra existe e está em status permitido
        const compra = await Compra.findByPk(idCompra)
        if (!compra) {
            return res.status(404).json({message: 'Compra não encontrada'})
        }

        if (compra.statusCompra !== 'AGUARDANDO_NOTA') {
            return res.status(400).json({message: 'Não é possível adicionar itens a uma compra já processada'})
        }

        // Verificar se produto existe
        const produto = await Produto.findByPk(idProduto)
        if (!produto) {
            return res.status(404).json({message: 'Produto não encontrado'})
        }

        // Verificar se item já existe na compra
        const itemExistente = await ItensCompra.findOne({
            where: { idCompra, idProduto }
        })

        if (itemExistente) {
            return res.status(400).json({message: 'Produto já existe na compra. Use atualizar quantidade.'})
        }

        const item = await ItensCompra.create({
            idCompra,
            idProduto,
            quantidade,
            custoUnitario
        })

        // Recalcular valor total da compra
        await recalcularTotalCompra(idCompra)

        const itemCompleto = await ItensCompra.findByPk(item.codItemCompra, {
            include: [
                { model: Compra, as: 'compraItem' },
                { model: Produto, as: 'produtoItemCompra' }
            ]
        })

        res.status(201).json(itemCompleto)
    } catch (err) {
        console.error('Erro ao adicionar item à compra', err)
        res.status(500).json({error: 'Erro ao adicionar item à compra', err})
    }
}

const atualizarItemCompra = async (req, res) => {
    const id = req.params.id
    const { quantidade, custoUnitario } = req.body
    
    if (!quantidade || !custoUnitario) {
        return res.status(400).json({message: "Quantidade e custo unitário são obrigatórios"})
    }

    if (quantidade <= 0) {
        return res.status(400).json({message: "Quantidade deve ser maior que zero"})
    }

    if (custoUnitario <= 0) {
        return res.status(400).json({message: "Custo unitário deve ser maior que zero"})
    }

    try {
        const item = await ItensCompra.findByPk(id, {
            include: [{ model: Compra, as: 'compraItem' }]
        })

        if (!item) {
            return res.status(404).json({message: 'Item não encontrado'})
        }

        // Verificar se compra permite alteração
        if (item.compraItem.statusCompra !== 'AGUARDANDO_NOTA') {
            return res.status(400).json({message: 'Não é possível alterar itens de uma compra já processada'})
        }

        await ItensCompra.update(
            { quantidade, custoUnitario },
            { where: { codItemCompra: id } }
        )

        // Recalcular valor total da compra
        await recalcularTotalCompra(item.idCompra)

        const itemAtualizado = await ItensCompra.findByPk(id, {
            include: [
                { model: Compra, as: 'compraItem' },
                { model: Produto, as: 'produtoItemCompra' }
            ]
        })

        res.status(200).json(itemAtualizado)
    } catch (err) {
        console.error('Erro ao atualizar item da compra', err)
        res.status(500).json({error: 'Erro ao atualizar item da compra', err})
    }
}

const removerItemCompra = async (req, res) => {
    const id = req.params.id

    try {
        const item = await ItensCompra.findByPk(id, {
            include: [{ model: Compra, as: 'compraItem' }]
        })

        if (!item) {
            return res.status(404).json({message: 'Item não encontrado'})
        }

        // Verificar se compra permite alteração
        if (item.compraItem.statusCompra !== 'AGUARDANDO_NOTA') {
            return res.status(400).json({message: 'Não é possível remover itens de uma compra já processada'})
        }

        const idCompra = item.idCompra

        await ItensCompra.destroy({ where: { codItemCompra: id } })

        // Recalcular valor total da compra
        await recalcularTotalCompra(idCompra)

        res.status(200).json({message: 'Item removido da compra com sucesso'})
    } catch (err) {
        console.error('Erro ao remover item da compra', err)
        res.status(500).json({error: 'Erro ao remover item da compra', err})
    }
}

const listarItensPorCompra = async (req, res) => {
    const idCompra = req.params.idCompra

    try {
        const itens = await ItensCompra.findAll({
            where: { idCompra },
            include: [
                { model: Compra, as: 'compraItem' },
                { model: Produto, as: 'produtoItemCompra' }
            ],
            order: [['codItemCompra', 'ASC']]
        })
        
        res.status(200).json(itens)
    } catch (err) {
        console.error('Erro ao listar itens da compra', err)
        res.status(500).json({error: 'Erro ao listar itens da compra', err})
    }
}

const listarItensPorProduto = async (req, res) => {
    const idProduto = req.params.idProduto

    try {
        const itens = await ItensCompra.findAll({
            where: { idProduto },
            include: [
                { model: Compra, as: 'compraItem' },
                { model: Produto, as: 'produtoItemCompra' }
            ],
            order: [['codItemCompra', 'DESC']]
        })
        
        res.status(200).json(itens)
    } catch (err) {
        console.error('Erro ao listar compras do produto', err)
        res.status(500).json({error: 'Erro ao listar compras do produto', err})
    }
}

// Função auxiliar para recalcular total da compra
async function recalcularTotalCompra(idCompra) {
    const itens = await ItensCompra.findAll({ where: { idCompra } })
    
    let valorTotal = 0
    for (const item of itens) {
        valorTotal += parseFloat(item.custoUnitario) * item.quantidade
    }

    await Compra.update(
        { valorTotal },
        { where: { codCompra: idCompra } }
    )
}

module.exports = {
    adicionarItemCompra,
    atualizarItemCompra,
    removerItemCompra,
    listarItensPorCompra,
    listarItensPorProduto
}