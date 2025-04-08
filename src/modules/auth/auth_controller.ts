import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { registerNewUser, loginUser, googleAuth } from "../auth/auth_service.js";
import RefreshTokenModel from "../tokens/refreshToken_model.js";
import dotenv from "dotenv";

dotenv.config();

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || "access_secret";
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || "refresh_secret";

const generateAccessToken = (userId: string) => {
    return jwt.sign({ userId }, ACCESS_TOKEN_SECRET, { expiresIn: "15m" });
};
const generateRefreshToken = (userId: string) => {
    return jwt.sign({ userId }, REFRESH_TOKEN_SECRET, { expiresIn: "7d" });
};

// Controlador para registrar un nuevo usuario
const registerCtrl = async ({ body }: Request, res: Response) => {
    try {
        const responseUser = await registerNewUser(body);
        res.json(responseUser);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// Controlador para iniciar sesión
const loginCtrl = async ({ body }: Request, res: Response) => {
    try {
        const { name, email, password } = body;
        const responseUser = await loginUser({ name, email, password });

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
        await RefreshTokenModel.create({
            token: refreshToken,
            userId: responseUser.id,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 días
        });

        return res.json({ accessToken, refreshToken });
    } catch (error: any) {
        return res.status(500).json({ message: error.message });
    }
};

// Controlador para manejar el refresh token
const refreshTokenHandler = async (req: Request, res: Response) => {
    const { token } = req.body;

    if (!token) {
        return res.status(401).json({ message: "Refresh token es requerido" });
    }

    try {
        // Verificar el refresh token
        const decoded: any = jwt.verify(token, REFRESH_TOKEN_SECRET);

        // Buscar el token en la base de datos
        const storedToken = await RefreshTokenModel.findOne({ token });
        if (!storedToken) {
            return res.status(403).json({ message: "Refresh token inválido" });
        }

        // Generar un nuevo access token
        const accessToken = generateAccessToken(decoded.userId);

        res.json({ accessToken });
    } catch (error) {
        res.status(403).json({ message: "Refresh token inválido o expirado" });
    }
};



// Controlador para manejar la autenticación con Google
const googleAuthCtrl = async (req: Request, res: Response) => {
    const redirectUri = process.env.GOOGLE_OAUTH_REDIRECT_URL;
    if (!redirectUri) {
        console.error("ERROR: GOOGLE_OAUTH_REDIRECT_URL no está definida en .env");
        return res.status(500).json({ message: "Error interno de configuración" });
    }
    const rootUrl = "https://accounts.google.com/o/oauth2/v2/auth";
    const options = new URLSearchParams({
        redirect_uri: process.env.GOOGLE_OAUTH_REDIRECT_URL!,
        client_id: process.env.GOOGLE_CLIENT_ID!,
        access_type: "offline",
        response_type: "code",
        prompt: "consent",
        scope: "https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email openid",
    });
    const fullUrl = `${rootUrl}?${options.toString()}`;
    console.log("Redireccionando a:", fullUrl);
    res.redirect(fullUrl);
};
    
// Controlador para manejar el callback de Google
const googleAuthCallback = async (req: Request, res: Response) => {
    try {
        const code = req.query.code as string;

        if (!code) {
            return res.status(400).json({ message: "Código de autorización faltante" });
        }

        const authData = await googleAuth(code);

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
    } catch (error: any) {
        console.error("Error en callback de Google:", error);
        res.redirect("/login?error=server_error");
    }
};

export { registerCtrl, loginCtrl, refreshTokenHandler, googleAuthCtrl, googleAuthCallback };