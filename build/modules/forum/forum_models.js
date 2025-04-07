import mongoose from 'mongoose';
const forumSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    comment: {
        type: String,
        required: true
    }
});
const Forum = mongoose.model('Forum', forumSchema);
export default Forum;
