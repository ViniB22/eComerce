// Funções do carrinho

// Adicionar ao carrinho
function addToCart(productId) {
    if (!currentUser) {
        alert('Por favor, faça login para adicionar produtos ao carrinho.');
        showSection('login');
        return;
    }
    
    const product = products.find(p => p.codProduto === productId);
    if (!product) return;
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.codProduto,
            name: product.nome,
            price: product.preco,
            quantity: 1,
            image: product.imagem_url
        });
    }
    
    updateCartStorage();
    updateCartCount();
    alert('Produto adicionado ao carrinho!');
}

// Remover do carrinho
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartStorage();
    updateCartDisplay();
    updateCartCount();
}

// Atualizar quantidade
function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            updateCartStorage();
            updateCartDisplay();
            updateCartCount();
        }
    }
}

// Atualizar storage do carrinho
function updateCartStorage() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Atualizar contador do carrinho
function updateCartCount() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById('cart-count').textContent = totalItems;
}

// Atualizar display do carrinho
function updateCartDisplay() {
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<div class="empty-cart">Seu carrinho está vazio</div>';
        cartTotal.textContent = '0,00';
        return;
    }
    
    let total = 0;
    
    cartItems.innerHTML = cart.map(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        return `
            <div class="cart-item">
                <div class="cart-item-image">
                    ${item.image ? 
                        `<img src="${item.image}" alt="${item.name}" style="max-width: 100%; max-height: 100%;">` : 
                        '📦'
                    }
                </div>
                <div class="cart-item-info">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">R$ ${item.price.toFixed(2)}</div>
                    <div class="cart-item-quantity">
                        <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                        <span>${item.quantity}</span>
                        <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                    </div>
                </div>
                <button class="cart-item-remove" onclick="removeFromCart(${item.id})">
                    Remover
                </button>
            </div>
        `;
    }).join('');
    
    cartTotal.textContent = total.toFixed(2);
}

// Finalizar compra
async function checkout() {
    if (!currentUser) {
        alert('Por favor, faça login para finalizar a compra.');
        showSection('login');
        return;
    }
    
    if (cart.length === 0) {
        alert('Seu carrinho está vazio!');
        return;
    }
    
    try {
        const orderData = {
            idUsuario: currentUser.codUsuario,
            itens: cart.map(item => ({
                idProduto: item.id,
                quantidade: item.quantity,
                precoUnitario: item.price
            })),
            valorTotal: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
        };
        
        const response = await fetch(`${API_BASE_URL}/pedidos`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(orderData)
        });
        
        if (response.ok) {
            alert('Pedido realizado com sucesso!');
            cart = [];
            updateCartStorage();
            updateCartDisplay();
            updateCartCount();
            showSection('home');
        } else {
            const error = await response.json();
            alert(error.error || 'Erro ao finalizar pedido');
        }
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro de conexão ao finalizar pedido');
    }
}