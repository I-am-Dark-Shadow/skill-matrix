import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    domain: {
      type: String,
    },
    tags: {
      type: [String],
      default: [],
    },
    github: {
      type: String,
      trim: true,
    },
    live: {
      type: String,
      trim: true,
    },
    teamSize: {
      type: Number,
      default: 1,
    },
    image: {
      public_id: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },
  },
  { timestamps: true }
);

export const Project = mongoose.model('Project', projectSchema);