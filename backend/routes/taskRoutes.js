import express from 'express';
import * as moment from 'moment';
import Task from '../models/taskModel';

const router = express.Router();

router.post('/add', (req, res) => {
  console.log(req.body);
  console.log(new Date());
  // , moment(req.body.deadline).format()
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
      userId: req.body.userId
    });

    newTask.save().then(task => {
      res.json(task);
    });
  });
});

router.post('/get', (req, res) => {
  console.log(req.body);
  Task.find({
    userId: req.body.userId
  }).then(foundTasks => {
    console.log(foundTasks);
    return res.json(foundTasks);
  });
});

router.post('/delete', (req, res) => {
  console.log(req.body);
  Task.findByIdAndRemove(req.body.id)
    .then(foundTask => {
      console.log(foundTask);
      return res.json(foundTask);
    });
});

export default router;
