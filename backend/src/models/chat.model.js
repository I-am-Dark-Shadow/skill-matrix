import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
    role: {
        type: String,
        enum: ['user', 'model'],
        required: true,
    },
    parts: {
        type: String,
        required: true,
    }
}, { _id: false });


const chatSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    title: {
        type: String,
        required: true,
        default: 'New Chat',
    },
    history: [messageSchema],
}, { timestamps: true });

export const Chat = mongoose.model('Chat', chatSchema);