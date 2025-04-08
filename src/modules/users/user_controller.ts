import { saveMethod, createUser, getAllUsers, getUserById, updateUser, deleteUser } from '../users/user_service.js';
import express, { Request, Response } from 'express';
import UserModel from '../users/user_models.js'; // Adjust the path as necessary
import { generateAccessToken } from '../auth/auth_service.js';
import jwt from 'jsonwebtoken';
import { REFRESH_TOKEN_SECRET } from '../../config/config.js'; // Adjust the path as necessary
import RefreshTokenModel from '../tokens/refreshToken_model.js'; // Asegúrate de importar el modelo correcto

export const saveMethodHandler = async (req: Request, res: Response) => {
    try {
        const data = saveMethod();
        res.json(data);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
export const createUserHandler = async (req: Request, res: Response) => {
    try {
        const data = await createUser(req.body);
        res.json(data);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
export const getAllUsersHandler = async (req: Request, res: Response) => {
    try {
        const data = await getAllUsers();
        res.json(data);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
export const getUserByIdHandler = async (req: Request, res: Response) => {
    try {
        const data = await getUserById(req.params.id);
        res.json(data);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
export const updateUserHandler = async (req: Request, res: Response) => {
    try {
        const data = await updateUser(req.params.id, req.body);
        res.json(data);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
export const deleteUserHandler = async (req: Request, res: Response) => {
    try {
        const data = await deleteUser(req.params.id);
        res.json(data);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};


export const loginHandler = async (req: Request, res: Response) => {
    const { username, password } = req.body;

    // Verificar las credenciales del usuario (ejemplo simplificado)
    const user = await UserModel.findOne({ username });
    if (!user || !(await user.comparePassword(password))) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generar access token
    const accessToken = generateAccessToken(user.id);

    // Generar refresh token
    const refreshToken = jwt.sign({ userId: user.id }, REFRESH_TOKEN_SECRET, { expiresIn: '7d' });

    // Guardar el refresh token en la base de datos
    await RefreshTokenModel.create({
        token: refreshToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 días
    });

    res.json({ accessToken, refreshToken });
};