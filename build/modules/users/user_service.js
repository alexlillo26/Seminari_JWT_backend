var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// src/services/user_service.ts
import User from '../users/user_models.js';
export const saveMethod = () => {
    return 'Hola';
};
export const createUser = (userData) => __awaiter(void 0, void 0, void 0, function* () {
    const user = new User(userData);
    return yield user.save();
});
export const getAllUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield User.find();
});
export const getUserById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield User.findById(id);
});
export const updateUser = (id, updateData) => __awaiter(void 0, void 0, void 0, function* () {
    return yield User.updateOne({ _id: id }, { $set: updateData });
});
export const deleteUser = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield User.deleteOne({ _id: id });
});
