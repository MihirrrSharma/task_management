const mongoose = require('mongoose');

const subtaskSchema = new mongoose.Schema({
    subject: String,
    deadline: Date,
    status: String,
    isDeleted: { type: Boolean, default: false },
});

const taskSchema = new mongoose.Schema({
    subject: String,
    deadline: Date,
    status: String,
    isDeleted: { type: Boolean, default: false },
    subtasks: [subtaskSchema],
});

const userSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    tasks: [taskSchema],
});

const User = mongoose.model('User', userSchema);

module.exports = User;
