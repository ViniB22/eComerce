// Funções para produtos

// Carregar produtos
async function loadProducts() {
    try {
        const response = await fetch(`${API_BASE_URL}/produtos`);
        const data = await response.json();
        
        if (response.ok) {
            products = data;
            displayProducts(products);
        } else {
            console.error('Erro ao carregar produtos');
        }
    } catch (error) {
        console.error('Erro:', error);
        // Mock data para demonstração
        displayMockProducts();
    }
}

// Carregar categorias
async function loadCategories() {
    try {
        const response = await fetch(`${API_BASE_URL}/categorias`);
        const data = await response.json();
        
        if (response.ok) {
            categories = data;
            populateCategoryFilter();
        }
    } catch (error) {
        console.error('Erro ao carregar categorias');
    }
}

// Popular filtro de categorias
function populateCategoryFilter() {
    const filter = document.getElementById('category-filter');
    filter.innerHTML = '<option value="">Todas as categorias</option>';
    
    categories.forEach(category => {
        if (category.is_ativo) {
            const option = document.createElement('option');
            option.value = category.codCategoria;
            option.textContent = category.nome;
            filter.appendChild(option);
        }
    });
    
    // Adicionar evento de filtro
    filter.addEventListener('change', filterProducts);
    document.getElementById('search-products').addEventListener('input', filterProducts);
}

// Filtrar produtos
function filterProducts() {
    const categoryFilter = document.getElementById('category-filter').value;
    const searchTerm = document.getElementById('search-products').value.toLowerCase();
    
    let filteredProducts = products;
    
    if (categoryFilter) {
        filteredProducts = filteredProducts.filter(product => 
            product.idCategoria == categoryFilter
        );
    }
    
    if (searchTerm) {
        filteredProducts = filteredProducts.filter(product =>
            product.nome.toLowerCase().includes(searchTerm) ||
            product.descricao.toLowerCase().includes(searchTerm)
        );
    }
    
    displayProducts(filteredProducts);
}

// Exibir produtos
function displayProducts(productsToDisplay) {
    const grid = document.getElementById('products-grid');
    
    if (productsToDisplay.length === 0) {
        grid.innerHTML = '<p class="empty-message">Nenhum produto encontrado.</p>';
        return;
    }
    
    grid.innerHTML = productsToDisplay.map(product => `
        <div class="product-card">
            <div class="product-image">
                ${product.imagem_url ? 
                    `<img src="${product.imagem_url}" alt="${product.nome}" style="max-width: 100%; max-height: 100%;">` : 
                    '📱'
                }
            </div>
            <div class="product-info">
                <h3>${product.nome}</h3>
                <p class="product-description">${product.descricao || 'Sem descrição'}</p>
                <div class="product-price">R$ ${product.preco.toFixed(2)}</div>
                <div class="product-actions">
                    <button class="btn-primary" onclick="addToCart(${product.codProduto})">
                        Adicionar ao Carrinho
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Mock data para demonstração
function displayMockProducts() {
    const mockProducts = [
        {
            codProduto: 1,
            nome: "Smartphone Samsung Galaxy",
            descricao: "Smartphone Android com 128GB",
            preco: 1299.99,
            imagem_url: null
        },
        {
            codProduto: 2,
            nome: "Notebook Dell Inspiron",
            descricao: "Notebook Intel i5, 8GB RAM",
            preco: 2499.99,
            imagem_url: null
        },
        {
            codProduto: 3,
            nome: "Fone de Ouvido Bluetooth",
            descricao: "Fone sem fio com cancelamento de ruído",
            preco: 299.99,
            imagem_url: null
        }
    ];
    
    products = mockProducts;
    displayProducts(products);
}