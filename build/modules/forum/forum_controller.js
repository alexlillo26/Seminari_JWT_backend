var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { createEntry, deleteEntry, getAllForum, getEntryById, updateEntry } from './forum_service.js';
export const createEntryHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield createEntry(req.body);
        res.json(data);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
export const getAllForumHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield getAllForum();
        res.json(data);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
export const getEntryByIdHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield getEntryById(req.params.id);
        res.json(data);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
export const updateEntryHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield updateEntry(req.params.id, req.body);
        res.json(data);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
export const deleteEntryHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield deleteEntry(req.params.id);
        res.json(data);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
