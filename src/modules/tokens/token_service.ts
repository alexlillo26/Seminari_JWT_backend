import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import RefreshTokenModel from './refreshToken_model.js';
import dotenv from 'dotenv';

dotenv.config();

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || 'access_secret';
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'refresh_secret';

// Generar un nuevo access token
export const generateAccessToken = (userId: string) => {
    return jwt.sign({ userId }, ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
};

// Endpoint para generar un nuevo refresh token
export const refreshTokenHandler = async (req: Request, res: Response) => {
    const { token } = req.body;

    if (!token) {
        return res.status(401).json({ message: 'Refresh token is required' });
    }

    try {
        // Verificar el refresh token
        const decoded: any = jwt.verify(token, REFRESH_TOKEN_SECRET);

        // Buscar el token en la base de datos
        const storedToken = await RefreshTokenModel.findOne({ token });
        if (!storedToken) {
            return res.status(403).json({ message: 'Invalid refresh token' });
        }

        // Generar un nuevo access token
        const accessToken = generateAccessToken(decoded.userId);

        res.json({ accessToken });
    } catch (error) {
        res.status(403).json({ message: 'Invalid or expired refresh token' });
    }
};