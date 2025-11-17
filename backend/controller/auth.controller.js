const Usuario = require('../model/Usuario')

const login = async (req,res)=>{
    const valores = req.body

    if(!valores.cpf || !valores.senha){
        return res.status(400).json({message: 'Para o login, informe cpf e senha!'})
    }

    valores.cpf = valores.cpf.replace(/[.-]/g, '')

    try{
        const dados = await Usuario.findOne({ where: {cpf: valores.cpf }})

        if(!dados){
            return res.status(404).json({message: 'Usuário não encontrado'})
        }

        if(valores.senha === dados.senha){
            return res.status(200).json({
                message: 'login realizado com sucesso!', 
                statusLog: true, 
                nome: dados.nome
            })
        }else{
            return res.status(401).json({message: 'Senha errada! Tente novamente!'})
        }

    }catch(err){
        console.error('Erro ao tentar fazer o login',err)
        res.status(500).json({message:'Erro ao tentar fazer o login'})
    }
}

module.exports = { login }