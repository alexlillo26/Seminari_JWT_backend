var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import Subject from "../subjects/subject_model.js";
export const saveMethod = () => {
    return 'Hola';
};
export const createSubject = (subjectData) => __awaiter(void 0, void 0, void 0, function* () {
    const subject = new Subject(subjectData);
    return yield subject.save();
});
export const getAllSubjects = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield Subject.find();
});
export const getSubjectById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield Subject.findById(id);
});
export const updateSubject = (id, updateData) => __awaiter(void 0, void 0, void 0, function* () {
    return yield Subject.updateOne({ _id: id }, { $set: updateData });
});
export const deleteSubject = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield Subject.deleteOne({ _id: id });
});
export const getUsersBySubject = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const subject = yield Subject.findById(id).populate('students');
    console.log(subject);
    return subject ? subject.students : [];
});
