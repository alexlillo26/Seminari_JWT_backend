import { encrypt, verified } from "../../utils/bcrypt.handle.js";
import jwt from "jsonwebtoken";
import User, { IUser } from "../users/user_models.js";
import RefreshTokenModel from "../tokens/refreshToken_model.js";
import { Auth } from "./auth_model.js";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";

dotenv.config();

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || "access_secret";
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || "refresh_secret";

// Función para generar un access token
const generateAccessToken = (userId: string) => {
    return jwt.sign({ userId }, ACCESS_TOKEN_SECRET, { expiresIn: "15m" });
};

// Función para generar un refresh token
const generateRefreshToken = (userId: string) => {
    return jwt.sign({ userId }, REFRESH_TOKEN_SECRET, { expiresIn: "7d" });
};

const registerNewUser = async ({ email, password, name, age }: any) => {
    const existingUser = await User.findOne({ email });
    if (existingUser) return "ALREADY_USER";

    // Encriptar la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear el usuario
    const newUser = await User.create({
        email,
        password: hashedPassword,
        name,
        age,
    });

    return newUser;
};

const loginUser = async ({ email, password }: any) => {
    const user = await User.findOne({ email });
    if (!user) return "NOT_FOUND_USER";

    // Comparar la contraseña ingresada con la almacenada
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) return "INCORRECT_PASSWORD";

    return user;
};
import { Request, Response } from "express";

const refreshTokenHandler = async (req: Request & { body: { token: string } }, res: Response) => {
    const { token } = req.body;

    if (!token) {
        return res.status(401).json({ message: "Refresh token es requerido" });
    }

    try {
        // Verificar el refresh token
        if (!process.env.REFRESH_TOKEN_SECRET) {
            throw new Error("REFRESH_TOKEN_SECRET is not defined");
        }
        const decoded: any = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);

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

const googleAuth = async (code: string) => {
    try {
        const tokenResponse = await axios.post(
            "https://oauth2.googleapis.com/token",
            {
                code,
                client_id: process.env.GOOGLE_CLIENT_ID,
                client_secret: process.env.GOOGLE_CLIENT_SECRET,
                redirect_uri: process.env.GOOGLE_OAUTH_REDIRECT_URL,
                grant_type: "authorization_code",
            },
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        const { access_token, id_token } = tokenResponse.data as { access_token: string; id_token: string };

        // Opcional: Obtener información del usuario
        const userInfoResponse = await axios.get(
            "https://www.googleapis.com/oauth2/v2/userinfo",
            {
                headers: {
                    Authorization: `Bearer ${access_token}`,
                },
            }
        );

        return {
            token: id_token,
            user: userInfoResponse.data,
        };
    } catch (error) {
        console.error("Error en googleAuth:", error);
        return null;
    }
};

export { registerNewUser, loginUser, generateAccessToken, generateRefreshToken, googleAuth };