import mongoose from 'mongoose';
// import bcrypt from 'bcrypt';

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
  }
}, { timestamps: true });

// UserSchema.methods.generateHash = password => {
//   return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
// };

// UserSchema.methods.validPassword = password => {
//   return bcrypt.compareSync(password, this.password);
// };

const User = mongoose.model('Users', UserSchema);

export default User;
