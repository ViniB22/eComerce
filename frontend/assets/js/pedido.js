// Referências aos elementos
const areaPedidos = document.getElementById('area-pedidos')
const btnVoltar = document.getElementById('btn-voltar')

// Função para formatar data
function formatarData(dataISO) {
    const data = new Date(dataISO)
    return data.toLocaleDateString('pt-BR') + ' ' + data.toLocaleTimeString('pt-BR', {hour: '2-digit', minute: '2-digit'})
}

// Função para obter classe CSS baseada no status
function obterClasseStatus(status) {
    switch(status) {
        case 'pendente': return 'status-pendente'
        case 'aprovado': return 'status-aprovado'
        case 'cancelado': return 'status-cancelado'
        default: return ''
    }
}

// Função para renderizar os pedidos
function mostrarPedidos() {
    // Verifica se o usuário está logado
    const statusLog = localStorage.getItem('statusLog')
    if (statusLog !== 'true') {
        areaPedidos.innerHTML = '<p>Você precisa fazer login para ver seus pedidos.</p>'
        return
    }

    const pedidos = JSON.parse(localStorage.getItem('pedidos')) || []

    if (pedidos.length === 0) {
        areaPedidos.innerHTML = '<p>Você ainda não fez nenhum pedido.</p>'
        return
    }

    let pedidosHTML = ''

    pedidos.forEach((pedido, index) => {
        pedidosHTML += `
            <div class="pedido">
                <div class="pedido-header">
                    <div>
                        <strong>Pedido #${index + 1}</strong>
                        <br>
                        <small>Data: ${formatarData(pedido.data)}</small>
                    </div>
                    <div class="pedido-status ${obterClasseStatus(pedido.status)}">
                        ${pedido.status.toUpperCase()}
                    </div>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th>Produto</th>
                            <th>Preço (R$)</th>
                            <th>Qtde</th>
                            <th>Subtotal (R$)</th>
                        </tr>
                    </thead>
                    <tbody>
        `

        pedido.produtos.forEach(produto => {
            const subtotal = produto.preco * produto.qtde
            pedidosHTML += `
                <tr>
                    <td>${produto.nome}</td>
                    <td>${produto.preco.toFixed(2)}</td>
                    <td>${produto.qtde}</td>
                    <td>${subtotal.toFixed(2)}</td>
                </tr>
            `
        })

        pedidosHTML += `
                    </tbody>
                    <tfoot>
                        <tr>
                            <td colspan="3" style="text-align: right; font-weight: bold;">Total:</td>
                            <td style="font-weight: bold;">R$ ${pedido.total.toFixed(2)}</td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        `
    })

    areaPedidos.innerHTML = pedidosHTML
}

// Botão de voltar à loja
btnVoltar.addEventListener('click', () => {
    window.location.href = 'index.html'
})

// Exibe os pedidos ao carregar a página
mostrarPedidos()