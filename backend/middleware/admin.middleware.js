// middleware/admin.middleware.js
const Usuario = require('../models/Usuario')

const adminMiddleware = async (req, res, next) => {
    try {
        // Verificar se o usuário está autenticado (vem do authMiddleware)
        if (!req.user) {
            return res.status(401).json({ 
                error: 'Usuário não autenticado' 
            })
        }

        // Buscar informações atualizadas do usuário no banco
        const usuario = await Usuario.findByPk(req.user.codUsuario, {
            attributes: ['codUsuario', 'tipo_usuario', 'nome', 'email']
        })

        if (!usuario) {
            return res.status(404).json({ 
                error: 'Usuário não encontrado' 
            })
        }

        // Verificar se o usuário é ADMIN
        if (usuario.tipo_usuario !== 'ADMIN') {
            return res.status(403).json({ 
                error: 'Acesso negado. Requer permissões de administrador.',
                message: 'Apenas usuários com perfil ADMIN podem acessar esta rota.',
                usuario: {
                    nome: usuario.nome,
                    tipo: usuario.tipo_usuario
                }
            })
        }

        // Adicionar informações do usuário à requisição
        req.userInfo = {
            codUsuario: usuario.codUsuario,
            nome: usuario.nome,
            email: usuario.email,
            tipo_usuario: usuario.tipo_usuario
        }

        console.log(`Acesso admin concedido para: ${usuario.nome} (${usuario.email})`)
        next()
        
    } catch (err) {
        console.error('Erro no middleware de admin:', err)
        res.status(500).json({ 
            error: 'Erro interno ao verificar permissões' 
        })
    }
}

// Middleware para logging de acesso administrativo
const adminLoggerMiddleware = (req, res, next) => {
    console.log(`Acesso administrativo:`, {
        metodo: req.method,
        rota: req.originalUrl,
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        timestamp: new Date().toISOString()
    })
    next()
}

module.exports = {
    adminMiddleware,
    adminOuProprioUsuarioMiddleware,
    adminLoggerMiddleware
}