import mongoose from 'mongoose';

const teamMemberSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    role: {
        type: String,
        enum: ['Leader', 'Frontend', 'Backend', 'Designer', 'Tester', 'Fullstack', 'DevOps', 'QA', 'Member'],
        default: 'Member'
    }
}, { _id: false });

const teamSchema = new mongoose.Schema({
    teamName: {
        type: String,
        required: true,
        trim: true,
    },
    teamLeader: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    members: [teamMemberSchema],
}, { timestamps: true });

export const Team = mongoose.model('Team', teamSchema);