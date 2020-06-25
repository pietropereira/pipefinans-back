"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    port: process.env.PORT || 3000,
    secretyKey: process.env.SECRETYKEY || '7a5c1e8a-b0e0-457e-afaa-e2f2f519c1af',
    publicRoutes: process.env.PUBLICROUTES || [
        'users/create',
        'users/auth',
    ]
};
//# sourceMappingURL=config.js.map