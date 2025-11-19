// estoque.controller.js
const Estoque = require('../models/Estoque')
const Produto = require('../models/Produto')

const listarEstoque = async (req, res) => {
    try {
        const dados = await Estoque.findAll({
            include: [{ model: Produto, as: 'produtoEstoque' }]
        })
        res.status(200).json(dados)
    } catch (err) {
        console.error('Erro ao listar estoque', err)
        res.status(500).json({error: 'Erro ao listar estoque', err})
    }
}

const atualizarEstoque = async (req, res) => {
    const idProduto = req.params.idProduto
    const { quantidade_atual, quantidade_minima } = req.body
    
    if (!idProduto) {
        return res.status(400).json({message: "ID do produto é obrigatório"})
    }

    try {
        let estoque = await Estoque.findOne({ where: { idProduto } })
        
        if (estoque) {
            await Estoque.update(
                { quantidade_atual, quantidade_minima }, 
                { where: { idProduto } }
            )
            estoque = await Estoque.findOne({ 
                where: { idProduto },
                include: [{ model: Produto, as: 'produtoEstoque' }]
            })
            res.status(200).json(estoque)
        } else {
            res.status(404).json({message: 'Produto não encontrado no estoque'})
        }
    } catch (err) {
        console.error('Erro ao atualizar estoque', err)
        res.status(500).json({error: 'Erro ao atualizar estoque', err})
    }
}

const listarEstoqueBaixo = async (req, res) => {
    try {
        const dados = await Estoque.findAll({
            where: {
                quantidade_atual: {
                    [Op.lte]: { [Op.col]: 'quantidade_minima' }
                }
            },
            include: [{ model: Produto, as: 'produtoEstoque' }]
        })
        res.status(200).json(dados)
    } catch (err) {
        console.error('Erro ao listar estoque baixo', err)
        res.status(500).json({error: 'Erro ao listar estoque baixo', err})
    }
}

module.exports = {
    listarEstoque,
    atualizarEstoque,
    listarEstoqueBaixo
}