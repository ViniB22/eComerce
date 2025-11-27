// assets/js/usuario.js
class UsuarioService {
    constructor() {
        this.baseURL = 'http://localhost:3000';
    }

    async cadastrar(dadosUsuario) {
        try {
            const response = await fetch(`${this.baseURL}/usuario`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dadosUsuario)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Erro ao cadastrar usuário');
            }

            return data;
        } catch (error) {
            throw error;
        }
    }

    validarCPF(cpf) {
        cpf = cpf.replace(/[^\d]+/g, '');
        if (cpf.length !== 11) return false;
        
        // Validação básica de CPF
        let soma = 0;
        for (let i = 0; i < 9; i++) {
            soma += parseInt(cpf.charAt(i)) * (10 - i);
        }
        
        let resto = soma % 11;
        let digito1 = resto < 2 ? 0 : 11 - resto;
        
        if (digito1 !== parseInt(cpf.charAt(9))) return false;
        
        soma = 0;
        for (let i = 0; i < 10; i++) {
            soma += parseInt(cpf.charAt(i)) * (11 - i);
        }
        
        resto = soma % 11;
        let digito2 = resto < 2 ? 0 : 11 - resto;
        
        return digito2 === parseInt(cpf.charAt(10));
    }

    validarTelefone(telefone) {
        const telefoneRegex = /^\(\d{2}\)\s\d{4,5}-\d{4}$/;
        return telefoneRegex.test(telefone);
    }

    validarEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    formatarCPF(cpf) {
        cpf = cpf.replace(/\D/g, '');
        return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    }

    formatarTelefone(telefone) {
        telefone = telefone.replace(/\D/g, '');
        if (telefone.length === 11) {
            return telefone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
        }
        return telefone.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    }
}

const usuarioService = new UsuarioService();

document.addEventListener('DOMContentLoaded', function() {
    const cadastroForm = document.getElementById('cadastroForm');
    const messageDiv = document.getElementById('message');
    const cadastroButton = document.getElementById('cadastroButton');
    const passwordStrength = document.getElementById('passwordStrength');

    // Formatação automática dos campos
    const cpfInput = document.getElementById('cpf');
    const telefoneInput = document.getElementById('telefone');
    const senhaInput = document.getElementById('senha');

    if (cpfInput) {
        cpfInput.addEventListener('input', function(e) {
            e.target.value = usuarioService.formatarCPF(e.target.value);
        });
    }

    if (telefoneInput) {
        telefoneInput.addEventListener('input', function(e) {
            e.target.value = usuarioService.formatarTelefone(e.target.value);
        });
    }

    if (cadastroForm) {
        cadastroForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Coletar dados do formulário
            const dados = {
                nome: document.getElementById('nome').value,
                email: document.getElementById('email').value,
                telefone: document.getElementById('telefone').value,
                cpf: document.getElementById('cpf').value,
                identidade: document.getElementById('identidade').value,
                senha: document.getElementById('senha').value,
                tipo_usuario: document.getElementById('tipo_usuario').value
            };

            // Validações
            if (!dados.nome || !dados.email || !dados.telefone || !dados.cpf || !dados.senha) {
                showMessage('Por favor, preencha todos os campos obrigatórios.', 'error');
                return;
            }

            if (!usuarioService.validarEmail(dados.email)) {
                showMessage('Por favor, insira um e-mail válido.', 'error');
                return;
            }

            if (!usuarioService.validarTelefone(dados.telefone)) {
                showMessage('Por favor, insira um telefone válido.', 'error');
                return;
            }

            if (!usuarioService.validarCPF(dados.cpf)) {
                showMessage('Por favor, insira um CPF válido.', 'error');
                return;
            }

            const confirmarSenha = document.getElementById('confirmarSenha').value;
            if (dados.senha !== confirmarSenha) {
                showMessage('As senhas não coincidem.', 'error');
                return;
            }

            try {
                // Mostrar loading
                cadastroButton.disabled = true;
                cadastroButton.textContent = 'Cadastrando...';
                cadastroForm.classList.add('loading');

                // Fazer cadastro
                const result = await usuarioService.cadastrar(dados);
                
                showMessage('Cadastro realizado com sucesso! Redirecionando para login...', 'success');
                
                // Redirecionar para login após breve delay
                setTimeout(() => {
                    window.location.href = './login.html';
                }, 2000);

            } catch (error) {
                showMessage(error.message, 'error');
            } finally {
                // Restaurar botão
                cadastroButton.disabled = false;
                cadastroButton.textContent = 'Criar Conta';
                cadastroForm.classList.remove('loading');
            }
        });
    }

    function showMessage(message, type) {
        messageDiv.textContent = message;
        messageDiv.className = `auth-message ${type}`;
        messageDiv.style.display = 'block';
        
        // Auto-esconder após 5 segundos (exceto sucesso)
        if (type !== 'success') {
            setTimeout(() => {
                messageDiv.style.display = 'none';
            }, 5000);
        }
    }
});