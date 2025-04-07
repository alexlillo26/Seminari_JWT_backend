var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { saveMethod, createSubject, getAllSubjects, getSubjectById, updateSubject, deleteSubject, getUsersBySubject } from "./subject_service.js";
export const saveMethodHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = saveMethod();
        res.json(data);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
export const createSubjectHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield createSubject(req.body);
        res.json(data);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
export const getAllSubjectsHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield getAllSubjects();
        res.json({
            data,
            user: req.user
        });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
export const getSubjectByIdHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield getSubjectById(req.params.id);
        res.json(data);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
export const updateSubjectHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield updateSubject(req.params.id, req.body);
        res.json(data);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
export const deleteSubjectHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield deleteSubject(req.params.id);
        res.json(data);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
export const getUsersBySubjectHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield getUsersBySubject(req.params.id);
        res.json(data);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
