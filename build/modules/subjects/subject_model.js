import mongoose from "mongoose";
const subjectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    teacher: {
        type: String,
        required: true
    },
    students: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User' // Referencia al modelo User
        }]
});
const Subject = mongoose.model('Subject', subjectSchema);
export default Subject;
