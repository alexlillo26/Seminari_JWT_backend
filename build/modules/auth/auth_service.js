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
exports.googleAuth = exports.generateRefreshToken = exports.generateAccessToken = exports.loginUser = exports.registerNewUser = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_models_js_1 = __importDefault(require("../users/user_models.js"));
const refreshToken_model_js_1 = __importDefault(require("../tokens/refreshToken_model.js"));
const dotenv_1 = __importDefault(require("dotenv"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
dotenv_1.default.config();
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || "access_secret";
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || "refresh_secret";
// Función para generar un access token
const generateAccessToken = (userId) => {
    return jsonwebtoken_1.default.sign({ userId }, ACCESS_TOKEN_SECRET, { expiresIn: "15m" });
};
exports.generateAccessToken = generateAccessToken;
// Función para generar un refresh token
const generateRefreshToken = (userId) => {
    return jsonwebtoken_1.default.sign({ userId }, REFRESH_TOKEN_SECRET, { expiresIn: "7d" });
};
exports.generateRefreshToken = generateRefreshToken;
const registerNewUser = ({ email, password, name, age }) => __awaiter(void 0, void 0, void 0, function* () {
    const existingUser = yield user_models_js_1.default.findOne({ email });
    if (existingUser)
        return "ALREADY_USER";
    // Encriptar la contraseña
    const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
    // Crear el usuario
    const newUser = yield user_models_js_1.default.create({
        email,
        password: hashedPassword,
        name,
        age,
    });
    return newUser;
});
exports.registerNewUser = registerNewUser;
const loginUser = ({ email, password }) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_models_js_1.default.findOne({ email });
    if (!user)
        return "NOT_FOUND_USER";
    // Comparar la contraseña ingresada con la almacenada
    const isPasswordCorrect = yield bcryptjs_1.default.compare(password, user.password);
    if (!isPasswordCorrect)
        return "INCORRECT_PASSWORD";
    return user;
});
exports.loginUser = loginUser;
const refreshTokenHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { token } = req.body;
    if (!token) {
        return res.status(401).json({ message: "Refresh token es requerido" });
    }
    try {
        // Verificar el refresh token
        if (!process.env.REFRESH_TOKEN_SECRET) {
            throw new Error("REFRESH_TOKEN_SECRET is not defined");
        }
        const decoded = jsonwebtoken_1.default.verify(token, process.env.REFRESH_TOKEN_SECRET);
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
const googleAuth = (code) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tokenResponse = yield axios.post("https://oauth2.googleapis.com/token", {
            code,
            client_id: process.env.GOOGLE_CLIENT_ID,
            client_secret: process.env.GOOGLE_CLIENT_SECRET,
            redirect_uri: process.env.GOOGLE_OAUTH_REDIRECT_URL,
            grant_type: "authorization_code",
        }, {
            headers: {
                "Content-Type": "application/json",
            },
        });
        const { access_token, id_token } = tokenResponse.data;
        // Opcional: Obtener información del usuario
        const userInfoResponse = yield axios.get("https://www.googleapis.com/oauth2/v2/userinfo", {
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
        });
        return {
            token: id_token,
            user: userInfoResponse.data,
        };
    }
    catch (error) {
        console.error("Error en googleAuth:", error);
        return null;
    }
});
exports.googleAuth = googleAuth;
