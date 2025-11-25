const express = require('express')
const cors = require('cors')

const app = express()

// ------------------ Middlewares globais ------------------
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors())

// ------------------ Rotas ------------------
const usuarioRoutes = require('../routes/usuario.routes')
const authRoutes = require('../routes/auth.routes')
const produtoRoutes = require('../routes/produto.routes')
const categoriaRoutes = require('../routes/categoria.routes')

const fornecedorRoutes = require('../routes/fornecedor.routes')
const compraRoutes = require('../routes/compra.routes')
const produtoFornecedorRoutes = require('../routes/produtoFornecedor.routes')
const pedidoRoutes = require('../routes/pedido.routes')
const itemPedidoRoutes = require('../routes/itemPedido.routes')
const entregaRoutes = require('../routes/entrega.routes')
const estoqueRoutes = require('../routes/estoque.routes')
const enderecoRoutes = require('../routes/endereco.routes')
const pagamentoRoutes = require('../routes/pagamento.routes')
const itensCompraRoutes = require('../routes/itensCompra.routes')

// Rotas existentes
app.use('/usuario', usuarioRoutes)
app.use('/', authRoutes)
app.use('/produto', produtoRoutes)
app.use('/categoria', categoriaRoutes)

app.use('/fornecedor', fornecedorRoutes)
app.use('/compra', compraRoutes)
app.use('/produto-fornecedor', produtoFornecedorRoutes)
app.use('/pedido', pedidoRoutes)
app.use('/item-pedido', itemPedidoRoutes)
app.use('/entrega', entregaRoutes)
app.use('/estoque', estoqueRoutes)
app.use('/endereco', enderecoRoutes)
app.use('/pagamento', pagamentoRoutes)
app.use('/itens-compra', itensCompraRoutes)

app.get('/', (req, res) => {
    res.status(200).json({message: 'API funcionando!'})
})

module.exports = app