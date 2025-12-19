import mongoose from 'mongoose';

const ProjectMemberSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    userEmail: {
      type: String,
      required: true,
    },
    userName: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['owner', 'admin', 'member', 'guest'],
      default: 'member',
    },
    invitedBy: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['active', 'pending', 'removed'],
      default: 'active',
    },
  },
  { timestamps: true }
);

// Prevent duplicate members
ProjectMemberSchema.index({ projectId: 1, userId: 1 }, { unique: true });

export default mongoose.models.ProjectMember || mongoose.model('ProjectMember', ProjectMemberSchema);
