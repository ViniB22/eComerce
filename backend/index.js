// index.js
const express = require('express')
const app = express()
const cors = require('cors')

const conn = require('./db/conn')

// Import dos controllers
const authController = require('./controller/auth.controller')
const usuarioController = require('./controller/usuario.controller')
const categoriaProdutoController = require('./controller/categoriaProduto.controller')
const produtoController = require('./controller/produto.controller')
const pedidoController = require('./controller/pedido.controller')
const itemPedidoController = require('./controller/itemPedido.controller')
const enderecoController = require('./controller/endereco.controller')
const fornecedorController = require('./controller/fornecedor.controller')
const compraController = require('./controller/compra.controller')
const itensCompraController = require('./controller/itensCompra.controller')
const estoqueController = require('./controller/estoque.controller')
const pagamentoController = require('./controller/pagamento.controller')
const entregaController = require('./controller/entrega.controller')
const produtoFornecedorController = require('./controller/produtoFornecedor.controller')

const authMiddleware = require('./middleware/auth.middleware')
const adminMiddleware = require('./middleware/admin.middleware') // Você pode criar esse depois

const PORT = 3000
const hostname = 'localhost'

// -------------- middlewares globais ----------------
app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(cors())
// ---------------------------------------------------

// ----------- rotas publicas ------------------------

// Autenticação
app.post('/registro', usuarioController.cadastrar)
app.post('/login', authController.login)

// Catálogo público
app.get('/produtos', produtoController.listarAtivos)
app.get('/produtos/:id', produtoController.buscarPorId)
app.get('/categorias', categoriaProdutoController.listar)

// ------------ rotas protegidas (requerem login) ---------
app.use(authMiddleware)

// Usuário
app.get('/usuario/perfil', (req, res) => {
    res.status(200).json({ user: req.user })
})
app.get('/usuario/enderecos', enderecoController.listarPorUsuario)
app.post('/usuario/enderecos', enderecoController.cadastrar)
app.put('/usuario/enderecos/:id/principal', enderecoController.definirPrincipal)
app.put('/usuario/enderecos/:id', enderecoController.atualizar)
app.delete('/usuario/enderecos/:id', enderecoController.remover)

// Pedidos do usuário
app.post('/pedidos', pedidoController.criarPedido)
app.get('/pedidos', pedidoController.listarPedidosUsuario)
app.get('/pedidos/:id', pedidoController.buscarPedidoPorId)

// Itens do pedido
app.post('/pedidos/itens', itemPedidoController.adicionarItem)
app.put('/pedidos/itens/:id', itemPedidoController.atualizarQuantidade)
app.delete('/pedidos/itens/:id', itemPedidoController.removerItem)
app.get('/pedidos/:idPedido/itens', itemPedidoController.listarItensPorPedido)

// Pagamentos
app.post('/pagamentos', pagamentoController.criarPagamento)
app.get('/pedidos/:idPedido/pagamentos', pagamentoController.listarPagamentosPedido)

// ------------ rotas administrativas (requerem admin) ---------
app.use(adminMiddleware) // Você pode implementar esse middleware depois

// Gerenciamento de Produtos (Admin)
app.post('/admin/produtos', produtoController.cadastrar)
app.get('/admin/produtos', produtoController.listar)
app.put('/admin/produtos/:id', produtoController.atualizar)
app.delete('/admin/produtos/:id', produtoController.desativar)

// Gerenciamento de Categorias (Admin)
app.post('/admin/categorias', categoriaProdutoController.cadastrar)
app.put('/admin/categorias/:id', categoriaProdutoController.atualizar)
app.delete('/admin/categorias/:id', categoriaProdutoController.apagar)

// Gerenciamento de Fornecedores (Admin)
app.post('/admin/fornecedores', fornecedorController.cadastrar)
app.get('/admin/fornecedores', fornecedorController.listar)
app.put('/admin/fornecedores/:id', fornecedorController.atualizar)

// Vínculos Produto-Fornecedor (Admin)
app.post('/admin/produto-fornecedor', produtoFornecedorController.vincularProdutoFornecedor)
app.get('/admin/produtos/:idProduto/fornecedores', produtoFornecedorController.listarFornecedoresDoProduto)
app.get('/admin/fornecedores/:idFornecedor/produtos', produtoFornecedorController.listarProdutosDoFornecedor)
app.put('/admin/produto-fornecedor/:id/custo', produtoFornecedorController.atualizarCusto)
app.delete('/admin/produto-fornecedor/:id', produtoFornecedorController.removerVinculo)

// Compras (Admin)
app.post('/admin/compras', compraController.criarCompra)
app.get('/admin/compras', compraController.listarCompras)
app.put('/admin/compras/:id/receber', compraController.receberCompra)
app.get('/admin/compras/:id', compraController.buscarCompraPorId)

// Itens de Compra (Admin)
app.post('/admin/compras/itens', itensCompraController.adicionarItemCompra)
app.put('/admin/compras/itens/:id', itensCompraController.atualizarItemCompra)
app.delete('/admin/compras/itens/:id', itensCompraController.removerItemCompra)
app.get('/admin/compras/:idCompra/itens', itensCompraController.listarItensPorCompra)
app.get('/admin/produtos/:idProduto/compras', itensCompraController.listarItensPorProduto)

// Estoque (Admin)
app.get('/admin/estoque', estoqueController.listarEstoque)
app.put('/admin/estoque/:idProduto', estoqueController.atualizarEstoque)
app.get('/admin/estoque/baixo', estoqueController.listarEstoqueBaixo)

// Gerenciamento de Pedidos (Admin)
app.put('/admin/pedidos/:id/status', pedidoController.atualizarStatus)

// Entregas (Admin)
app.post('/admin/entregas', entregaController.criarEntrega)
app.put('/admin/entregas/:id/status', entregaController.atualizarStatusEntrega)
app.put('/admin/entregas/:id/rastreio', entregaController.atualizarCodigoRastreio)
app.get('/admin/pedidos/:idPedido/entrega', entregaController.buscarEntregaPorPedido)

// Pagamentos (Admin)
app.put('/admin/pagamentos/:id/status', pagamentoController.atualizarStatusPagamento)
app.get('/admin/compras/:idCompra/pagamentos', pagamentoController.listarPagamentosCompra)

// Rota de saúde da aplicação
app.get('/', (req, res) => {
    res.status(200).json({ 
        message: "🛒 API E-commerce Rodando!",
        timestamp: new Date().toISOString(),
        version: "1.0.0"
    })
})

// Rota para verificar autenticação
app.get('/protegida', authMiddleware, (req, res) => {
    res.status(200).json({ 
        message: "Rota protegida acessada com sucesso!",
        usuario: req.user
    })
})

// ---------------- server -------------------------------------
conn.sync({ force: false }) // Use { force: true } apenas em desenvolvimento para recriar tabelas
.then(() => {
    app.listen(PORT, hostname, () => {
        console.log(`Servidor E-commerce rodando em http://${hostname}:${PORT}`)
        console.log(`Documentação das rotas:`)
        console.log(`   Rotas públicas: /login, /registro, /produtos, /categorias`)
        console.log(`   Rotas usuário: /usuario/*, /pedidos/*`)
        console.log(`   Rotas admin: /admin/*`)
    })
})
.catch((err) => {
    console.error('Erro de conexão com o banco de dados!', err)
})

// Middleware para rotas não encontradas
app.use('*', (req, res) => {
    res.status(404).json({ 
        error: 'Rota não encontrada',
        path: req.originalUrl,
        method: req.method
    })
})

// Middleware de tratamento de erros
app.use((err, req, res, next) => {
    console.error('Erro não tratado:', err)
    res.status(500).json({ 
        error: 'Erro interno do servidor',
        message: process.env.NODE_ENV === 'development' ? err.message : 'Algo deu errado'
    })
})