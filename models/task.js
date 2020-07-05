/* eslint-disable no-use-before-define */
const mongoose = require('mongoose');
const timestamp = require('mongoose-timestamp');

const taskSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true,
    trim: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  image: {
    url: String,
    public_id: String,
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
  },
});

taskSchema.plugin(timestamp);

taskSchema.statics.deleteTask = async function (author, taskId) {
  const task = await Task.findOne({ author, _id: taskId });

  if (!task) {
    throw new Error('Unable to carry out operation');
  }

  await Task.deleteOne({ author, _id: taskId });
  return task;
};

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
