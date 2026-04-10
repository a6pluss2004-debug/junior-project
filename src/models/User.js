  import mongoose from 'mongoose';

  const UserSchema = new mongoose.Schema({
    name: {
      type: String,
      required: [true, 'Please provide a name'],
      maxlength: [60, 'Name cannot be more than 60 characters'],
      unique: true,
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
    },
  }, { timestamps: true });

  // Prevent recompilation of model in development
  export default mongoose.models.User || mongoose.model('User', UserSchema);
