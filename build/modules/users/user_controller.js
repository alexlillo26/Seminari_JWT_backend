var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// src/controllers/user_controller.ts
import { saveMethod, createUser, getAllUsers, getUserById, updateUser, deleteUser } from '../users/user_service.js';
export const saveMethodHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = saveMethod();
        res.json(data);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
export const createUserHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield createUser(req.body);
        res.json(data);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
export const getAllUsersHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield getAllUsers();
        res.json(data);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
export const getUserByIdHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield getUserById(req.params.id);
        res.json(data);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
export const updateUserHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield updateUser(req.params.id, req.body);
        res.json(data);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
export const deleteUserHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield deleteUser(req.params.id);
        res.json(data);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
