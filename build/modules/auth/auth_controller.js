"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.googleAuthCallback = exports.googleAuthCtrl = exports.refreshTokenHandler = exports.loginCtrl = exports.registerCtrl = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const auth_service_js_1 = require("../auth/auth_service.js");
const refreshToken_model_js_1 = __importDefault(require("../tokens/refreshToken_model.js"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || "access_secret";
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || "refresh_secret";
const generateAccessToken = (userId) => {
    return jsonwebtoken_1.default.sign({ userId }, ACCESS_TOKEN_SECRET, { expiresIn: "15m" });
};
const generateRefreshToken = (userId) => {
    return jsonwebtoken_1.default.sign({ userId }, REFRESH_TOKEN_SECRET, { expiresIn: "7d" });
};
// Controlador para registrar un nuevo usuario
const registerCtrl = ({ body }, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const responseUser = yield (0, auth_service_js_1.registerNewUser)(body);
        res.json(responseUser);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.registerCtrl = registerCtrl;
// Controlador para iniciar sesión
const loginCtrl = ({ body }, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, password } = body;
        const responseUser = yield (0, auth_service_js_1.loginUser)({ name, email, password });
        if (responseUser === "INCORRECT_PASSWORD") {
            return res.status(403).json({ message: "Contraseña incorrecta" });
        }
        if (responseUser === "NOT_FOUND_USER") {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }
        // Generar tokens
        const accessToken = generateAccessToken(responseUser.id);
        const refreshToken = generateRefreshToken(responseUser.id);
        // Guardar el refresh token en la base de datos
        yield refreshToken_model_js_1.default.create({
            token: refreshToken,
            userId: responseUser.id,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 días
        });
        return res.json({ accessToken, refreshToken });
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
});
exports.loginCtrl = loginCtrl;
// Controlador para manejar el refresh token
const refreshTokenHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { token } = req.body;
    if (!token) {
        return res.status(401).json({ message: "Refresh token es requerido" });
    }
    try {
        // Verificar el refresh token
        const decoded = jsonwebtoken_1.default.verify(token, REFRESH_TOKEN_SECRET);
        // Buscar el token en la base de datos
        const storedToken = yield refreshToken_model_js_1.default.findOne({ token });
        if (!storedToken) {
            return res.status(403).json({ message: "Refresh token inválido" });
        }
        // Generar un nuevo access token
        const accessToken = generateAccessToken(decoded.userId);
        res.json({ accessToken });
    }
    catch (error) {
        res.status(403).json({ message: "Refresh token inválido o expirado" });
    }
});
exports.refreshTokenHandler = refreshTokenHandler;
// Controlador para manejar la autenticación con Google
const googleAuthCtrl = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const redirectUri = process.env.GOOGLE_OAUTH_REDIRECT_URL;
    if (!redirectUri) {
        console.error("ERROR: GOOGLE_OAUTH_REDIRECT_URL no está definida en .env");
        return res.status(500).json({ message: "Error interno de configuración" });
    }
    const rootUrl = "https://accounts.google.com/o/oauth2/v2/auth";
    const options = new URLSearchParams({
        redirect_uri: process.env.GOOGLE_OAUTH_REDIRECT_URL,
        client_id: process.env.GOOGLE_CLIENT_ID,
        access_type: "offline",
        response_type: "code",
        prompt: "consent",
        scope: "https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email openid",
    });
    const fullUrl = `${rootUrl}?${options.toString()}`;
    console.log("Redireccionando a:", fullUrl);
    res.redirect(fullUrl);
});
exports.googleAuthCtrl = googleAuthCtrl;
// Controlador para manejar el callback de Google
const googleAuthCallback = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const code = req.query.code;
        if (!code) {
            return res.status(400).json({ message: "Código de autorización faltante" });
        }
        const authData = yield (0, auth_service_js_1.googleAuth)(code);
        if (!authData) {
            return res.redirect("/login?error=authentication_failed");
        }
        console.log(authData.token);
        res.cookie("token", authData.token, {
            httpOnly: true,
            secure: false,
            sameSite: "none",
            maxAge: 86400000, // 1 día
        });
        res.redirect(`http://localhost:4200/?token=${authData.token}`);
    }
    catch (error) {
        console.error("Error en callback de Google:", error);
        res.redirect("/login?error=server_error");
    }
});
exports.googleAuthCallback = googleAuthCallback;
