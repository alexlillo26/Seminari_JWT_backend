var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import Forum from './forum_models.js';
export const createEntry = (forumData) => __awaiter(void 0, void 0, void 0, function* () {
    const user = new Forum(forumData);
    return yield user.save();
});
export const getAllForum = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield Forum.find();
});
export const getEntryById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield Forum.findById(id);
});
export const updateEntry = (id, updateData) => __awaiter(void 0, void 0, void 0, function* () {
    return yield Forum.updateOne({ _id: id }, { $set: updateData });
});
export const deleteEntry = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield Forum.deleteOne({ _id: id });
});
