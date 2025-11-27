// assets/js/carrinho.js
class CarrinhoService {
    constructor() {
        this.carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
        this.init();
    }

    init() {
        this.atualizarBadge();
        this.renderizarCarrinho();
        this.configurarEventos();
    }

    adicionarProduto(produto, quantidade = 1) {
        const produtoExistente = this.carrinho.find(item => 
            item.codProduto === produto.codProduto
        );

        if (produtoExistente) {
            produtoExistente.quantidade += quantidade;
        } else {
            this.carrinho.push({
                ...produto,
                quantidade: quantidade
            });
        }

        this.salvarCarrinho();
        this.atualizarBadge();
        this.mostrarFeedback(`${quantidade}x ${produto.nome} adicionado ao carrinho!`, 'success');
    }

    removerProduto(codProduto) {
        this.carrinho = this.carrinho.filter(item => item.codProduto !== codProduto);
        this.salvarCarrinho();
        this.atualizarBadge();
        this.renderizarCarrinho();
    }

    atualizarQuantidade(codProduto, novaQuantidade) {
        if (novaQuantidade < 1) {
            this.removerProduto(codProduto);
            return;
        }

        const produto = this.carrinho.find(item => item.codProduto === codProduto);
        if (produto) {
            produto.quantidade = novaQuantidade;
            this.salvarCarrinho();
            this.renderizarCarrinho();
        }
    }

    limparCarrinho() {
        this.carrinho = [];
        this.salvarCarrinho();
        this.atualizarBadge();
        this.renderizarCarrinho();
    }

    calcularTotal() {
        return this.carrinho.reduce((total, item) => {
            return total + (item.preco * item.quantidade);
        }, 0);
    }

    salvarCarrinho() {
        localStorage.setItem('carrinho', JSON.stringify(this.carrinho));
    }

    atualizarBadge() {
        const badge = document.getElementById('carrinhoBadge');
        if (badge) {
            const totalItens = this.carrinho.reduce((total, item) => total + item.quantidade, 0);
            if (totalItens > 0) {
                badge.textContent = totalItens;
                badge.style.display = 'inline';
            } else {
                badge.style.display = 'none';
            }
        }
    }

    renderizarCarrinho() {
        const carrinhoItens = document.getElementById('carrinhoItens');
        const carrinhoResumo = document.getElementById('carrinhoResumo');
        const carrinhoVazio = document.getElementById('carrinhoVazio');
        const carrinhoTotal = document.getElementById('carrinhoTotal');

        if (this.carrinho.length === 0) {
            carrinhoItens.innerHTML = '';
            carrinhoResumo.style.display = 'none';
            carrinhoVazio.style.display = 'block';
            return;
        }

        carrinhoVazio.style.display = 'none';
        carrinhoResumo.style.display = 'block';

        let html = '';
        this.carrinho.forEach(item => {
            const subtotal = item.preco * item.quantidade;
            html += `
                <div class="carrinho-item">
                    <img src="${item.imagem_url || '../assets/images/placeholder.jpg'}" 
                         alt="${item.nome}" 
                         onerror="this.src='../assets/images/placeholder.jpg'">
                    <div class="carrinho-item-info">
                        <div class="carrinho-item-nome">${item.nome}</div>
                        <div class="carrinho-item-preco">R$ ${item.preco.toFixed(2)}</div>
                        <div class="carrinho-item-descricao">${item.descricao || ''}</div>
                    </div>
                    <div class="carrinho-item-controles">
                        <div class="quantidade-controle">
                            <button class="quantidade-btn" 
                                    onclick="carrinhoService.atualizarQuantidade(${item.codProduto}, ${item.quantidade - 1})">-</button>
                            <input type="number" 
                                   class="quantidade-input" 
                                   value="${item.quantidade}" 
                                   min="1"
                                   onchange="carrinhoService.atualizarQuantidade(${item.codProduto}, parseInt(this.value))">
                            <button class="quantidade-btn" 
                                    onclick="carrinhoService.atualizarQuantidade(${item.codProduto}, ${item.quantidade + 1})">+</button>
                        </div>
                        <div class="carrinho-item-subtotal">
                            R$ ${subtotal.toFixed(2)}
                        </div>
                        <button class="remover-item" 
                                onclick="carrinhoService.removerProduto(${item.codProduto})">
                            Remover
                        </button>
                    </div>
                </div>
            `;
        });

        carrinhoItens.innerHTML = html;
        carrinhoTotal.textContent = `Total: R$ ${this.calcularTotal().toFixed(2)}`;
    }

    async finalizarCompra() {
        if (!authService.isAuthenticated()) {
            this.mostrarFeedback('Você precisa estar logado para finalizar a compra!', 'error');
            setTimeout(() => {
                window.location.href = 'produto.html'; // Vai para produtos em vez de login
            }, 2000);
            return;
        }

        if (this.carrinho.length === 0) {
            this.mostrarFeedback('Seu carrinho está vazio!', 'error');
            return;
        }

        try {
            const pedido = {
                itens: this.carrinho,
                total: this.calcularTotal(),
                idUsuario: authService.getUsuario().id
            };

            const response = await fetch('http://localhost:3000/pedido', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authService.getToken()}`
                },
                body: JSON.stringify(pedido)
            });

            if (!response.ok) {
                throw new Error('Erro ao finalizar pedido');
            }

            const resultado = await response.json();
            
            this.mostrarFeedback('Pedido realizado com sucesso!', 'success');
            this.limparCarrinho();
            
            // Mostrar detalhes do pedido no modal
            this.mostrarDetalhesPedido(resultado);

        } catch (error) {
            console.error('Erro ao finalizar compra:', error);
            this.mostrarFeedback('Erro ao finalizar compra. Tente novamente.', 'error');
        }
    }

    mostrarDetalhesPedido(pedido) {
        const modal = document.getElementById('modalFinalizacao');
        const modalContent = document.getElementById('modalContent');
        
        modalContent.innerHTML = `
            <div class="success">
                <p><strong>Pedido realizado com sucesso!</strong></p>
            </div>
            <p><strong>Número do Pedido:</strong> #${pedido.codPedido || '0001'}</p>
            <p><strong>Status:</strong> ${pedido.status || 'PENDENTE_PAGAMENTO'}</p>
            <p><strong>Total:</strong> R$ ${pedido.valorTotal || this.calcularTotal().toFixed(2)}</p>
            <p><strong>Data:</strong> ${new Date().toLocaleDateString()}</p>
            <div style="margin-top: 1rem;">
                <button onclick="carrinhoService.fecharModal()" class="btn-primary">
                    Continuar Comprando
                </button>
            </div>
        `;
        
        modal.style.display = 'block';
    }

    fecharModal() {
        const modal = document.getElementById('modalFinalizacao');
        modal.style.display = 'none';
        window.location.href = 'produto.html'; // Volta para produtos após fechar modal
    }

    configurarEventos() {
        // Botão continuar comprando
        document.getElementById('btnContinuarComprando')?.addEventListener('click', () => {
            window.location.href = 'produto.html';
        });

        // Botão explorar produtos
        document.getElementById('btnExplorarProdutos')?.addEventListener('click', () => {
            window.location.href = 'produto.html';
        });

        // Botão finalizar compra
        document.getElementById('btnFinalizarCompra')?.addEventListener('click', () => {
            this.finalizarCompra();
        });

        // Botão limpar carrinho
        document.getElementById('btnLimparCarrinho')?.addEventListener('click', () => {
            if (confirm('Tem certeza que deseja limpar o carrinho?')) {
                this.limparCarrinho();
                this.mostrarFeedback('Carrinho limpo!', 'success');
            }
        });

        // Fechar modal
        document.getElementById('closeModal')?.addEventListener('click', () => {
            this.fecharModal();
        });

        // Fechar modal clicando fora
        window.addEventListener('click', (e) => {
            const modal = document.getElementById('modalFinalizacao');
            if (e.target === modal) {
                this.fecharModal();
            }
        });
    }

    mostrarFeedback(mensagem, tipo) {
        // Criar elemento de feedback
        const feedback = document.createElement('div');
        feedback.className = `auth-message ${tipo}`;
        feedback.textContent = mensagem;
        feedback.style.position = 'fixed';
        feedback.style.top = '20px';
        feedback.style.right = '20px';
        feedback.style.zIndex = '1001';
        
        document.body.appendChild(feedback);
        
        setTimeout(() => {
            feedback.remove();
        }, 3000);
    }
}

// Instância global do carrinho
const carrinhoService = new CarrinhoService();