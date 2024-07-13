const User = require('../models/userModel');

exports.listSubtasks = async (req, res) => {
    const { userId, taskId } = req.params;
    try {
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const task = user.tasks.id(taskId);
        if (!task || task.isDeleted) return res.status(404).json({ message: 'Task not found' });

        const subtasks = task.subtasks.filter(subtask => !subtask.isDeleted);
        res.json(subtasks);
    } catch (error) {
        next(error);     
    }
};

exports.addSubtask = async (req, res) => {
    const { userId, taskId } = req.params;
    const { subject, deadline, status } = req.body;
    try {
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const task = user.tasks.id(taskId);
        if (!task || task.isDeleted) return res.status(404).json({ message: 'Task not found' });

        const newSubtask = { subject, deadline, status };
        task.subtasks.push(newSubtask);
        await user.save();

        res.status(201).json(newSubtask);
    } catch (error) {
        next(error);     
    }
};

exports.updateSubtasks = async (req, res) => {
    const { userId, taskId } = req.params;
    const { subtasks } = req.body;
    try {
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const task = user.tasks.id(taskId);
        if (!task || task.isDeleted) return res.status(404).json({ message: 'Task not found' });

        const newSubtasksMap = new Map(subtasks.map(subtask => [subtask._id, subtask]));

        task.subtasks.forEach(subtask => {
            if (newSubtasksMap.has(subtask._id)) {
                const newSubtask = newSubtasksMap.get(subtask._id);
                subtask.subject = newSubtask.subject;
                subtask.deadline = newSubtask.deadline;
                subtask.status = newSubtask.status;
                subtask.isDeleted = false; 
                newSubtasksMap.delete(subtask._id); 
            } else {
                subtask.isDeleted = true; 
            }
        });

        newSubtasksMap.forEach((newSubtask) => {
            task.subtasks.push(newSubtask);
        });

        await user.save();

        const updatedSubtasks = task.subtasks.filter(subtask => !subtask.isDeleted);
        res.json(updatedSubtasks);
    } catch (error) {
        next(error);
    }
};

exports.deleteSubtask = async (req, res) => {
    const { userId, taskId, subtaskId } = req.params;
    try {
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const task = user.tasks.id(taskId);
        if (!task || task.isDeleted) return res.status(404).json({ message: 'Task not found' });

        const subtask = task.subtasks.id(subtaskId);
        if (!subtask || subtask.isDeleted) return res.status(404).json({ message: 'Subtask not found' });

        subtask.isDeleted = true;
        await user.save();

        res.json({ message: 'Subtask marked as deleted' });
    } catch (error) {
        next(error); 
    }
};
