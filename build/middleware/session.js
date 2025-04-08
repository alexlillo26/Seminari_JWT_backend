"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkJwt = void 0;
const jwt_handle_js_1 = require("../utils/jwt.handle.js");
const checkJwt = (req, res, next) => {
    try {
        const jwtByUser = req.headers.authorization || null;
        const jwt = jwtByUser === null || jwtByUser === void 0 ? void 0 : jwtByUser.split(' ').pop(); // ['Bearer', '11111'] -> ['11111']
        console.log(jwt);
        const isUser = (0, jwt_handle_js_1.verifyToken)(`${jwt}`);
        if (!isUser) {
            return res.status(401).send("NO_TIENES_UN_JWT_VALIDO"); // return para evitar llamar a next()
        }
        req.user = isUser;
        next(); // Solo si el token es válido, pasa al siguiente middleware
    }
    catch (e) {
        console.error("Error en checkJwt:", e);
        return res.status(401).send("SESSION_NO_VALID"); // Asegúrate de detener con return
    }
};
exports.checkJwt = checkJwt;
