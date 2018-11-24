import mongoose from 'mongoose';

const { Schema } = mongoose;

const TaskSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  deadline: {
    type: Date,
    required: true
  },
  userId: {
    type: String,
    required: true
  }
}, { timestamps: true });

const Task = mongoose.model('Tasks', TaskSchema);

export default Task;
