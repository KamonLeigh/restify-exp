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

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
