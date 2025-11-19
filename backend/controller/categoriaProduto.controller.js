const CategoriaProduto = require('../models/CategoriaProduto')

const cadastrar = async(req,res)=>{
    const valores = req.body
    if (!valores.nome) {
        return res.status(400).json({message:"O campo nome é obrigatórios"})
    }
    try {
        const dados = await CategoriaProduto.create(valores)
        res.status(201).json(dados)
    } catch (err) {
        console.error('Erro ao cadastrar',err)
        res.status(500).json({error:'Erro ao cadastrar',err})
    }
}
const listar = async(req,res)=>{
    try {
        const dados = await CategoriaProduto.findAll()
        res.status(200).json(dados)
    } catch (err) {
        console.error('Erro ao listar',err)
        res.status(500).json({error:'Erro ao listar',err})
    }
}
const atualizar = async(req,res)=>{
    const id = req.params.id
    const valores = req.body
    if (!valores.nome || !id) {
        return res.status(400).json({message:"Os campos código e nome são obrigatórios"})
    }
    try {
        let dados = await CategoriaProduto.findByPk(id)
        if(dados){
            await CategoriaProduto.update(valores,{where:{codCategoria:id}})
            dados = await CategoriaProduto.findByPk(id)
            res.status(204).json(dados)
        }else{
            res.status(404).json({message:'Código não encontrado'})
        }
    } catch (err) {
        console.error('Erro ao atualizar',err)
        res.status(500).json({error:'Erro ao atualizar',err})
    }
}
const apagar = async(req,res)=>{
    const id = req.params.id
    if (!id) {
        return res.status(400).json({message:"Os campos código é obrigatórios"})
    }
    try {
        let dados = await CategoriaProduto.findByPk(id)
        if(dados){
            await CategoriaProduto.destroy({where:{codCategoria:id}})
            res.status(204).json({message:'Dados apagados com sucesso'})
        }else{
            res.status(404).json({message:'Código não encontrado'})
        }
    } catch (err) {
        console.error('Erro ao apagar',err)
        res.status(500).json({error:'Erro ao apagar',err})
    }
}
module.exports = {
    cadastrar,
    listar,
    atualizar,
    apagar
}