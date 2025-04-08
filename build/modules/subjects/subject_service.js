"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUsersBySubject = exports.deleteSubject = exports.updateSubject = exports.getSubjectById = exports.getAllSubjects = exports.createSubject = exports.saveMethod = void 0;
const subject_model_js_1 = __importDefault(require("../subjects/subject_model.js"));
const saveMethod = () => {
    return 'Hola';
};
exports.saveMethod = saveMethod;
const createSubject = (subjectData) => __awaiter(void 0, void 0, void 0, function* () {
    const subject = new subject_model_js_1.default(subjectData);
    return yield subject.save();
});
exports.createSubject = createSubject;
const getAllSubjects = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield subject_model_js_1.default.find();
});
exports.getAllSubjects = getAllSubjects;
const getSubjectById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield subject_model_js_1.default.findById(id);
});
exports.getSubjectById = getSubjectById;
const updateSubject = (id, updateData) => __awaiter(void 0, void 0, void 0, function* () {
    return yield subject_model_js_1.default.updateOne({ _id: id }, { $set: updateData });
});
exports.updateSubject = updateSubject;
const deleteSubject = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield subject_model_js_1.default.deleteOne({ _id: id });
});
exports.deleteSubject = deleteSubject;
const getUsersBySubject = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const subject = yield subject_model_js_1.default.findById(id).populate('students');
    console.log(subject);
    return subject ? subject.students : [];
});
exports.getUsersBySubject = getUsersBySubject;
