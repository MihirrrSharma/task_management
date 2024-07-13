const express = require('express');
const { listTasks, addTask, editTask, deleteTask, createUser } = require('../controllers/taskController');
const router = express.Router();

router.post('/user', createUser); 

router.get('/:userId/tasks', listTasks);
router.post('/:userId/tasks', addTask);
router.put('/:userId/tasks/:taskId', editTask);
router.delete('/:userId/tasks/:taskId', deleteTask);

module.exports = router;


