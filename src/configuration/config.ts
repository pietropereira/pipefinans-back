export default {
    port: process.env.PORT || 3000,
    secretyKey: process.env.SECRETYKEY || '7a5c1e8a-b0e0-457e-afaa-e2f2f519c1af',
    email: 'contato.pipe@outlook.com',
    pass: '@mcpf1972',
    publicRoutes: process.env.PUBLICROUTES || [
        'users/create',
        'users/auth',
        'users/forgotpassword'
    ]
}