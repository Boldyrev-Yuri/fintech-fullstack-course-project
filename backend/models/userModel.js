import mongoose from 'mongoose';

const { Schema } = mongoose;

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  validated: {
    type: Boolean,
    required: true,
    default: false
  }
}, { timestamps: true });

const User = mongoose.model('Users', UserSchema);

export default User;
