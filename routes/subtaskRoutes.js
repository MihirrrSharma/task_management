const express = require('express');
const { listSubtasks, addSubtask, updateSubtasks, deleteSubtask } = require('../controllers/subtaskController');
const router = express.Router();

router.get('/:userId/tasks/:taskId/subtasks', listSubtasks);
router.post('/:userId/tasks/:taskId/subtasks', addSubtask);
router.put('/:userId/tasks/:taskId/subtasks', updateSubtasks);
router.delete('/:userId/tasks/:taskId/subtasks/:subtaskId', deleteSubtask);

module.exports = router;


