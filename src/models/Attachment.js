import mongoose from 'mongoose';

const AttachmentSchema = new mongoose.Schema(
  {
    fileName: {
      type: String,
      required: true,
    },
    fileUrl: {
      type: String,
      required: true,
    },
    fileSize: {
      type: Number,
      required: true,
    },
    fileType: {
      type: String,
      required: true,
    },
    taskId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Task',
      required: true,
    },
    uploadedBy: {
      type: String,
      required: true,
    },
    userName: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

AttachmentSchema.index({ taskId: 1 });

export default mongoose.models.Attachment || mongoose.model('Attachment', AttachmentSchema);
