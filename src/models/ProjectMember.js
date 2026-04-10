import mongoose from 'mongoose';

const ProjectMemberSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    role: {
      type: String,
      enum: ['owner', 'admin', 'member', 'guest'],
      default: 'member',
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

delete mongoose.models.ProjectMember;
export default mongoose.models.ProjectMember || mongoose.model('ProjectMember', ProjectMemberSchema);
