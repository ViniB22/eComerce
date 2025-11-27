let resList = document.getElementById('resList')
let resCad = document.getElementById('resCad')
let resAtualizar = document.getElementById('resAtualizar')
let resAtualizarParcial = document.getElementById('resAtualizarParcial')
let resDel = document.getElementById('resDel')
let resDetalhes = document.getElementById('resDetalhes')
let detalhesProduto = document.getElementById('detalhesProduto')

let cadastrar = document.getElementById('cadastrar')
let atualizar = document.getElementById('atualizar')
let atualizarParcial = document.getElementById('atualizarParcial')
let apagar = document.getElementById('apagar')
let btnFiltrar = document.getElementById('btnFiltrar')

const token = sessionStorage.getItem('token')
let produtos = []
let categorias = []

if (statusLog === 'true') {
    onload = () => {
        carregarProdutos()
        carregarCategorias()
    }

    // Carregar produtos
    function carregarProdutos() {
        fetch(`http://localhost:3000/produtos`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
            .then(resp => resp.json())
            .then(dados => {
                produtos = dados
                exibirProdutos(produtos)
            })
            .catch((err) => {
                console.error('Erro ao carregar produtos', err)
                resList.innerHTML = '<p class="error">Erro ao carregar produtos</p>'
            })
    }

    // Carregar categorias para os selects
    function carregarCategorias() {
        fetch(`http://localhost:3000/categorias`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
            .then(resp => resp.json())
            .then(dados => {
                categorias = dados.filter(cat => cat.is_ativo)
                preencherSelectCategorias()
            })
            .catch((err) => {
                console.error('Erro ao carregar categorias', err)
            })
    }

    // Preencher selects de categoria
    function preencherSelectCategorias() {
        const selects = ['idCategoria', 'idCategoriaUp', 'categoriaFilter']

        selects.forEach(selectId => {
            const select = document.getElementById(selectId)
            if (select) {
                // Manter a primeira opção e adicionar categorias
                const primeiraOpcao = select.options[0]
                select.innerHTML = ''
                select.appendChild(primeiraOpcao)

                categorias.forEach(categoria => {
                    const option = document.createElement('option')
                    option.value = categoria.codCategoria
                    option.textContent = categoria.nome
                    select.appendChild(option)
                })
            }
        })
    }

    // Filtrar produtos
    btnFiltrar.addEventListener('click', filtrarProdutos)

    function filtrarProdutos() {
        const searchTerm = document.getElementById('searchProduto').value.toLowerCase()
        const categoriaId = document.getElementById('categoriaFilter').value
        const status = document.getElementById('statusFilter').value

        let produtosFiltrados = produtos

        if (searchTerm) {
            produtosFiltrados = produtosFiltrados.filter(produto =>
                produto.nome.toLowerCase().includes(searchTerm) ||
                produto.descricao?.toLowerCase().includes(searchTerm) ||
                produto.modelo.toLowerCase().includes(searchTerm)
            )
        }

        if (categoriaId) {
            produtosFiltrados = produtosFiltrados.filter(produto =>
                produto.idCategoria == categoriaId
            )
        }

        if (status !== '') {
            produtosFiltrados = produtosFiltrados.filter(produto =>
                produto.ativo.toString() === status
            )
        }

        exibirProdutos(produtosFiltrados)
    }

    // Cadastrar produto
    cadastrar.addEventListener('click', () => {
        const nome = document.getElementById('nome').value
        const descricao = document.getElementById('descricao').value
        const modelo = document.getElementById('modelo').value
        const preco = Number(document.getElementById('preco').value)
        const idCategoria = Number(document.getElementById('idCategoria').value)
        const imagem_url = document.getElementById('imagem_url').value
        const ativo = document.getElementById('ativo').value === 'true'

        if (!nome || !modelo || !preco || !idCategoria) {
            resCad.innerHTML = '<p class="error">Preencha todos os campos obrigatórios</p>'
            return
        }

        const valores = {
            nome,
            descricao,
            modelo,
            preco,
            idCategoria,
            imagem_url,
            ativo
        }

        console.log('Cadastrando produto:', valores)

        fetch(`http://localhost:3000/produtos`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' ,
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(valores)
        })
            .then(resp => resp.json())
            .then(dados => {
                console.log('Produto cadastrado:', dados)
                resCad.innerHTML = `
                    <p class="success">Produto cadastrado com sucesso!</p>
                    <div class="produto-info">
                        <strong>${dados.produto.nome}</strong><br>
                        Código: ${dados.produto.codProduto}<br>
                        Modelo: ${dados.produto.modelo}<br>
                        Preço: R$ ${dados.produto.preco}<br>
                        Status: ${dados.produto.ativo ? 'Ativo' : 'Inativo'}
                    </div>
                `
                // Limpar formulário
                document.getElementById('nome').value = ''
                document.getElementById('descricao').value = ''
                document.getElementById('modelo').value = ''
                document.getElementById('preco').value = ''
                document.getElementById('imagem_url').value = ''

                // Recarregar lista
                carregarProdutos()
            })
            .catch((err) => {
                console.error('Erro ao cadastrar', err)
                resCad.innerHTML = `<p class="error">Erro ao cadastrar produto: ${err.message}</p>`
            })
    })

    // Atualizar produto completo
    atualizar.addEventListener('click', () => {
        const codProduto = Number(document.getElementById('codProdutoUp').value)
        const nome = document.getElementById('nomeUp').value
        const descricao = document.getElementById('descricaoUp').value
        const modelo = document.getElementById('modeloUp').value
        const preco = Number(document.getElementById('precoUp').value)
        const idCategoria = Number(document.getElementById('idCategoriaUp').value)
        const imagem_url = document.getElementById('imagem_urlUp').value
        const ativo = document.getElementById('ativoUp').value === 'true'

        if (!codProduto || !nome || !modelo || !preco || !idCategoria) {
            resAtualizar.innerHTML = '<p class="error">Preencha todos os campos obrigatórios</p>'
            return
        }

        const valores = {
            nome,
            descricao,
            modelo,
            preco,
            idCategoria,
            imagem_url,
            ativo
        }

        console.log('Atualizando produto:', valores)

        fetch(`http://localhost:3000/produtos/${codProduto}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`},
            body: JSON.stringify(valores)
        })
            .then(resp => resp.json())
            .then(dados => {
                console.log('Produto atualizado:', dados)
                resAtualizar.innerHTML = `
                    <p class="success">Produto atualizado com sucesso!</p>
                    <div class="produto-info">
                        <strong>${dados.produto.nome}</strong><br>
                        Código: ${dados.produto.codProduto}<br>
                        Modelo: ${dados.produto.modelo}<br>
                        Preço: R$ ${dados.produto.preco}<br>
                        Status: ${dados.produto.ativo ? 'Ativo' : 'Inativo'}
                    </div>
                `
                carregarProdutos()
            })
            .catch((err) => {
                console.error('Erro ao atualizar', err)
                resAtualizar.innerHTML = `<p class="error">Erro ao atualizar produto: ${err.message}</p>`
            })
    })

    // Atualizar parcialmente
    atualizarParcial.addEventListener('click', () => {
        const codProduto = Number(document.getElementById('codProdutoPatch').value)
        const preco = document.getElementById('precoPatch').value ? Number(document.getElementById('precoPatch').value) : null
        const descricao = document.getElementById('descricaoPatch').value
        const ativo = document.getElementById('ativoPatch').value

        if (!codProduto) {
            resAtualizarParcial.innerHTML = '<p class="error">Informe o código do produto</p>'
            return
        }

        const valores = {}
        if (preco !== null) valores.preco = preco
        if (descricao) valores.descricao = descricao
        if (ativo) valores.ativo = ativo === 'true'

        if (Object.keys(valores).length === 0) {
            resAtualizarParcial.innerHTML = '<p class="error">Informe pelo menos um campo para atualizar</p>'
            return
        }

        console.log('Atualizando parcialmente:', valores)

        fetch(`http://localhost:3000/produtos/${codProduto}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`},
            body: JSON.stringify(valores)
        })
            .then(resp => resp.json())
            .then(dados => {
                console.log('Produto atualizado parcialmente:', dados)
                resAtualizarParcial.innerHTML = `
                    <p class="success">Produto atualizado parcialmente com sucesso!</p>
                    <div class="produto-info">
                        <strong>${dados.produto.nome}</strong><br>
                        Código: ${dados.produto.codProduto}<br>
                        ${preco ? `Preço: R$ ${dados.produto.preco}<br>` : ''}
                        ${ativo ? `Status: ${dados.produto.ativo ? 'Ativo' : 'Inativo'}<br>` : ''}
                    </div>
                `
                carregarProdutos()
            })
            .catch((err) => {
                console.error('Erro ao atualizar parcial', err)
                resAtualizarParcial.innerHTML = `<p class="error">Erro ao atualizar produto: ${err.message}</p>`
            })
    })

    // Deletar produto
    apagar.addEventListener('click', () => {
        const codProduto = Number(document.getElementById('codProdutoDel').value)

        if (!codProduto) {
            resDel.innerHTML = '<p class="error">Informe o código do produto</p>'
            return
        }

        if (!confirm(`Tem certeza que deseja deletar o produto ${codProduto}?`)) {
            return
        }

        fetch(`http://localhost:3000/produtos/${codProduto}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` }
        })
            .then(resp => resp.json())
            .then(dados => {
                resDel.innerHTML = `<p class="success">${dados.mensagem}</p>`
                document.getElementById('codProdutoDel').value = ''
                carregarProdutos()
            })
            .catch((err) => {
                console.error('Erro ao apagar', err)
                resDel.innerHTML = `<p class="error">Erro ao deletar produto: ${err.message}</p>`
            })
    })

    // Exibir produtos em tabela
    function exibirProdutos(produtosParaExibir) {
        if (produtosParaExibir.length === 0) {
            resList.innerHTML = '<p class="no-data">Nenhum produto encontrado</p>'
            return
        }

        resList.innerHTML = `<table>${criarTabela(produtosParaExibir)}</table>`
    }

    function criarTabela(dados) {
        let tab = `<thead>
                        <th>Código</th>
                        <th>Nome</th>
                        <th>Modelo</th>
                        <th>Preço</th>
                        <th>Categoria</th>
                        <th>Status</th>
                        <th>Ações</th>
                   </thead>`
        tab += `<tbody>`
        dados.forEach(produto => {
            const categoria = categorias.find(cat => cat.codCategoria === produto.idCategoria)
            tab += `<tr>
                        <td>${produto.codProduto}</td>
                        <td>${produto.nome}</td>
                        <td>${produto.modelo}</td>
                        <td>R$ ${produto.preco}</td>
                        <td>${categoria ? categoria.nome : '-'}</td>
                        <td>${produto.ativo ? '🟢 Ativo' : '🔴 Inativo'}</td>
                        <td>
                            <button onclick="verDetalhes(${produto.codProduto})" class="btn-info">Ver</button>
                            <button onclick="preencherFormularioAtualizacao(${produto.codProduto})" class="btn-secondary">Editar</button>
                        </td>
                    </tr>`
        })
        tab += `</tbody>`
        return tab
    }

    // Funções globais para os botões de ação
    window.verDetalhes = function (codProduto) {
        const produto = produtos.find(p => p.codProduto === codProduto)
        if (produto) {
            const categoria = categorias.find(cat => cat.codCategoria === produto.idCategoria)
            resDetalhes.innerHTML = `
                <div class="produto-detalhes">
                    <h3>${produto.nome}</h3>
                    <p><strong>Código:</strong> ${produto.codProduto}</p>
                    <p><strong>Modelo:</strong> ${produto.modelo}</p>
                    <p><strong>Descrição:</strong> ${produto.descricao || 'Sem descrição'}</p>
                    <p><strong>Preço:</strong> R$ ${produto.preco}</p>
                    <p><strong>Categoria:</strong> ${categoria ? categoria.nome : 'Não categorizado'}</p>
                    <p><strong>Status:</strong> ${produto.ativo ? 'Ativo' : 'Inativo'}</p>
                    ${produto.imagem_url ? `<p><strong>Imagem:</strong> <a href="${produto.imagem_url}" target="_blank">Ver imagem</a></p>` : ''}
                </div>
            `
            detalhesProduto.style.display = 'block'
        }
    }

    window.preencherFormularioAtualizacao = function (codProduto) {
        const produto = produtos.find(p => p.codProduto === codProduto)
        if (produto) {
            document.getElementById('codProdutoUp').value = produto.codProduto
            document.getElementById('nomeUp').value = produto.nome
            document.getElementById('descricaoUp').value = produto.descricao || ''
            document.getElementById('modeloUp').value = produto.modelo
            document.getElementById('precoUp').value = produto.preco
            document.getElementById('idCategoriaUp').value = produto.idCategoria
            document.getElementById('imagem_urlUp').value = produto.imagem_url || ''
            document.getElementById('ativoUp').value = produto.ativo.toString()

            // Scroll para o formulário de atualização
            document.getElementById('codProdutoUp').scrollIntoView({ behavior: 'smooth' })
        }
    }

} else {
    location.href = '../index.html'
}