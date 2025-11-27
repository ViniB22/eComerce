let resList = document.getElementById('resList')
let resCad = document.getElementById('resCad')
let resAtualizar = document.getElementById('resAtualizar')
let resAtualizarParcial = document.getElementById('resAtualizarParcial')
let resDel = document.getElementById('resDel')
let cadastrar = document.getElementById('cadastrar')
let atualizar = document.getElementById('atualizar')
let atualizarParcial = document.getElementById('atualizarParcial')
let apagar = document.getElementById('apagar')

let statusLog = localStorage.getItem('statusLog')

if (statusLog === 'true') {
    onload = () => {
        fetch(`http://localhost:3000/enderecos`)
            .then(resp => resp.json())
            .then(dados => {
                resList.innerHTML = `<table>${criarTabela(dados)}</table>`
            })
            .catch((err) => {
                console.error('Erro ao listar', err)
            })
    }

    cadastrar.addEventListener('click', () => {
        const idUsuario = Number(document.getElementById('idUsuario').value)
        const cep = document.getElementById('cep').value
        const logradouro = document.getElementById('logradouro').value
        const numero = document.getElementById('numero').value
        const complemento = document.getElementById('complemento').value
        const bairro = document.getElementById('bairro').value
        const localidade = document.getElementById('localidade').value
        const uf = document.getElementById('uf').value
        const apelido = document.getElementById('apelido').value
        const is_principal = document.getElementById('is_principal').value === 'true'

        const valores = {
            idUsuario,
            cep,
            logradouro,
            numero,
            complemento,
            bairro,
            localidade,
            uf,
            apelido,
            is_principal
        }

        console.log(valores)

        fetch(`http://localhost:3000/enderecos`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(valores)
        })
            .then(resp => resp.json())
            .then(dados => {
                console.log(dados);

                resCad.innerHTML = `Endereço cadastrado: <br>
                            código: ${dados.endereco.codEndereco} <br>
                            ID do usuário: ${dados.endereco.idUsuario} <br>
                            CEP: ${dados.endereco.cep} <br>
                            logradouro: ${dados.endereco.logradouro} <br>
                            número: ${dados.endereco.numero} <br>
                            complemento: ${dados.endereco.complemento || '-'} <br>
                            bairro: ${dados.endereco.bairro} <br>
                            cidade: ${dados.endereco.localidade} <br>
                            UF: ${dados.endereco.uf} <br>
                            apelido: ${dados.endereco.apelido || '-'} <br>
                            principal: ${dados.endereco.is_principal ? 'Sim' : 'Não'} <br>
                            mensagem: ${dados.mensagem} <hr>`
            })
            .catch((err) => {
                console.error('Erro ao cadastrar', err)
            })
    })

    atualizar.addEventListener('click', () => {
        const codEndereco = Number(document.getElementById('codEnderecoUp').value)
        const idUsuario = Number(document.getElementById('idUsuarioUp').value)
        const cep = document.getElementById('cepUp').value
        const logradouro = document.getElementById('logradouroUp').value
        const numero = document.getElementById('numeroUp').value
        const complemento = document.getElementById('complementoUp').value
        const bairro = document.getElementById('bairroUp').value
        const localidade = document.getElementById('localidadeUp').value
        const uf = document.getElementById('ufUp').value
        const apelido = document.getElementById('apelidoUp').value
        const is_principal = document.getElementById('is_principalUp').value === 'true'

        const valores = {
            idUsuario,
            cep,
            logradouro,
            numero,
            complemento,
            bairro,
            localidade,
            uf,
            apelido,
            is_principal
        }

        console.log(valores)

        fetch(`http://localhost:3000/enderecos/${codEndereco}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(valores)
        })
            .then(resp => resp.json())
            .then(dados => {
                console.log(dados)

                resAtualizar.innerHTML = `Endereço atualizado: <br>
                            código: ${dados.endereco.codEndereco} <br>
                            ID do usuário: ${dados.endereco.idUsuario} <br>
                            CEP: ${dados.endereco.cep} <br>
                            logradouro: ${dados.endereco.logradouro} <br>
                            número: ${dados.endereco.numero} <br>
                            complemento: ${dados.endereco.complemento || '-'} <br>
                            bairro: ${dados.endereco.bairro} <br>
                            cidade: ${dados.endereco.localidade} <br>
                            UF: ${dados.endereco.uf} <br>
                            apelido: ${dados.endereco.apelido || '-'} <br>
                            principal: ${dados.endereco.is_principal ? 'Sim' : 'Não'} <br>
                            mensagem: ${dados.mensagem} <hr>`
            })
            .catch((err) => {
                console.error('Erro ao atualizar', err)
            })
    })

    atualizarParcial.addEventListener('click', () => {
        const codEndereco = Number(document.getElementById('codEnderecoPatch').value)
        const complemento = document.getElementById('complementoPatch').value
        const apelido = document.getElementById('apelidoPatch').value
        const is_principal = document.getElementById('is_principalPatch').value

        const valores = {}
        if (complemento) valores.complemento = complemento
        if (apelido) valores.apelido = apelido
        if (is_principal) valores.is_principal = is_principal === 'true'

        console.log(valores)

        fetch(`http://localhost:3000/enderecos/${codEndereco}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(valores)
        })
            .then(resp => resp.json())
            .then(dados => {
                console.log(dados)

                resAtualizarParcial.innerHTML = `Endereço atualizado parcialmente: <br>
                            código: ${dados.endereco.codEndereco} <br>
                            complemento: ${dados.endereco.complemento || '-'} <br>
                            apelido: ${dados.endereco.apelido || '-'} <br>
                            principal: ${dados.endereco.is_principal ? 'Sim' : 'Não'} <br>
                            mensagem: ${dados.mensagem} <hr>`
            })
            .catch((err) => {
                console.error('Erro ao atualizar parcial', err)
            })
    })

    apagar.addEventListener('click', () => {
        const codEndereco = Number(document.getElementById('codEnderecoDel').value)

        fetch(`http://localhost:3000/enderecos/${codEndereco}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' }
        })
            .then(resp => resp.json())
            .then(dados => {
                resDel.innerHTML = `${dados.mensagem}`
            })
            .catch((err) => {
                console.error('Erro ao apagar', err)
            })
    })
} else {
    location.href = '../index.html'
}

function criarTabela(dados) {
    console.log(dados)
    let tab = `<thead>
                    <th>Código</th>
                    <th>ID Usuário</th>
                    <th>CEP</th>
                    <th>Logradouro</th>
                    <th>Número</th>
                    <th>Bairro</th>
                    <th>Cidade</th>
                    <th>UF</th>
                    <th>Principal</th>
               </thead>`
    tab += `<tbody>`
    dados.forEach(dad => {
        tab += `<tr>
                    <td>${dad.codEndereco}</td>
                    <td>${dad.idUsuario}</td>
                    <td>${dad.cep}</td>
                    <td>${dad.logradouro}</td>
                    <td>${dad.numero}</td>
                    <td>${dad.bairro}</td>
                    <td>${dad.localidade}</td>
                    <td>${dad.uf}</td>
                    <td>${dad.is_principal ? 'Sim' : 'Não'}</td>
                </tr>`
    })
    tab += `</tbody>`
    return tab
}