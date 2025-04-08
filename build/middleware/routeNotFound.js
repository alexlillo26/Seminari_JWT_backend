"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.routeNotFound = void 0;
function routeNotFound(req, res, next) {
    const error = new Error('Route Not Found');
    console.log(error);
    return res.status(404).json({ error: error.message }); // 👈 Añadido return
}
exports.routeNotFound = routeNotFound;
