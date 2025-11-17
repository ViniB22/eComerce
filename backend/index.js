const express = require('express')
const app = express()
const cors = require('cors')

const conn = require('./db/conn')

const authController = require('./controller/auth.controller')
const clienteController = require('./controller/cliente.controller')

const authMiddleware = require('./middleware/auth.middleware')

const PORT = 3000
const hostname = 'localhost'

// -------------- middlewares globais ----------------
app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(cors())
// ---------------------------------------------------


// ----------- rotas publicas ------------------------
app.post('/cliente', clienteController.cadastrar)
app.post('/login', authController.login)

// ------------ rotas protegidas ou privadas ---------
// app.use(authMiddleware)  => inserindo a verificação de middleware 

app.get('/cliente', authMiddleware , clienteController.listar)

app.get('/', authMiddleware, (req,res)=>{
    res.status(200).json({message: "Aplicação Rodando"})
})

// ---------------- server -------------------------------------
conn.sync()
.then(()=>{
    app.listen(PORT, hostname, ()=>{
        console.log(`Servidor rodando em http://${hostname}:${PORT}`)
    })
})
.catch((err)=>{
    console.error('Erro de conexão com o banco de dados!',err)
})