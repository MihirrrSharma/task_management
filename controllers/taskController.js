const User = require('../models/userModel');

exports.createUser = async (req, res) => {
    const { name, email } = req.body;
    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User with this email already exists' });
        }

        user = new User({ name, email });
        await user.save();
        res.status(201).json(user);
    } catch (error) {
        next(error); 
    }
};

exports.listTasks = async (req, res) => {
    const { userId } = req.params;
    try {
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const tasks = user.tasks
            .filter(task => !task.isDeleted)
            .map(task => {
                const subtasks = task.subtasks.filter(subtask => !subtask.isDeleted);
                return { ...task.toObject(), subtasks };
            });

        res.json(tasks);
    } catch (error) {
        next(error); 
    }
};

exports.addTask = async (req, res) => {
    const { userId } = req.params;
    const { subject, deadline, status } = req.body;
    try {
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const newTask = { subject, deadline, status };
        user.tasks.push(newTask);
        await user.save();

        res.status(201).json(newTask);
    } catch (error) {
        next(error); 
    }
};

exports.editTask = async (req, res, next) => {
    const { userId, taskId } = req.params;
    const { subject, deadline, status } = req.body;
    try {
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const task = user.tasks.id(taskId);
        if (!task || task.isDeleted) return res.status(404).json({ message: 'Task not found' });

        task.subject = subject;
        task.deadline = deadline;
        task.status = status;
        await user.save();

        const updatedTask = task.toObject();
        updatedTask.subtasks = updatedTask.subtasks.filter(subtask => !subtask.isDeleted);

        res.json(updatedTask);
    } catch (error) {
        next(error);
    }
};

exports.deleteTask = async (req, res) => {
    const { userId, taskId } = req.params;
    try {
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const task = user.tasks.id(taskId);
        if (!task || task.isDeleted) return res.status(404).json({ message: 'Task not found' });

        task.isDeleted = true;
        await user.save();

        res.json({ message: 'Task marked as deleted' });
    } catch (error) {
        next(error); 
    }
};