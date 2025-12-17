import mongoose from 'mongoose';

const ProjectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a project title'],
    maxlength: [50, 'Title cannot be more than 50 characters'],
  },
  description: {
    type: String,
    maxlength: [200, 'Description cannot be more than 200 characters'],
  },
  ownerId: {
    // THIS PART IS CRITICAL
    type: mongoose.Schema.Types.ObjectId, // Must be ObjectId
    ref: 'User',
    required: true,
  },
}, { timestamps: true });

export default mongoose.models.Project || mongoose.model('Project', ProjectSchema);
