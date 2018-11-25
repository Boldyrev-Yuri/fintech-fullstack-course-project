import express from 'express';
import Task from '../models/taskModel';

const router = express.Router();

router.post('/add', (req, res) => {
  Task.findOne({
    name: req.body.name,
    description: req.body.description,
    deadline: req.body.deadline,
    userId: req.body.userId
  }).then(foundTask => {
    if (foundTask) {
      return res.status(400).json({
        name: 'У вас уже есть такая задача :('
      });
    }

    const newTask = new Task({
      name: req.body.name,
      description: req.body.description,
      deadline: req.body.deadline,
      userId: req.body.userId,
      status: false,
      notify: req.body.notify
    });

    newTask.save().then(task => {
      res.json(task);
    });
  });
});

router.post('/get', (req, res) => {
  Task.find({
    userId: req.body.userId
  }).then(foundTasks => {
    return res.json(foundTasks);
  });
});

router.post('/delete', (req, res) => {
  Task.findByIdAndRemove(req.body.id)
    .then(foundTask => {
      return res.json(foundTask);
    });
});

router.post('/edit', (req, res) => {
  Task.findByIdAndUpdate(req.body.id, {
    name: req.body.name,
    description: req.body.description,
    deadline: req.body.deadline,
    notify: req.body.notify
  }, { new: true })
    .then(foundTask => {
      return res.json(foundTask);
    });
});

router.post('/toggle', (req, res) => {
  Task.findByIdAndUpdate(req.body.id, { status: true }, { new: true })
    .then(foundTask => {
      return res.json(foundTask);
    });
});

export default router;
