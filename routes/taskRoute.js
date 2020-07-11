/* eslint-disable no-return-assign */
/* eslint-disable no-underscore-dangle */
const errors = require('restify-errors');
const Task = require('../models/task');
const { auth } = require('../middleware');
const cloudinary = require('../utils/cloudinary');

function taskRouter(server) {
  server.get('/tasks', auth, async (req, res, next) => {
    const match = {};
    const sort = {};

    if (req.query.completed) {
      match.completed = req.query.completed === 'true';
    }

    if (req.query.sortBy) {
      const path = req.query.sortBy.split(':');
      sort[path[0]] = path[1] === 'asc' ? 1 : -1;
    }

    try {
      await req.user.populate({
        path: 'tasks',
        match,
        sort,
      }).execPopulate();

      res.send(200, req.user.tasks);
      return next();
    } catch (error) {
      return next(new errors.InternalServerError(error));
    }
  });

  server.get('/task/:id', auth, async (req, res, next) => {
    const _id = req.params.id;

    try {
      const task = await Task.findOne({ _id, author: req.user._id });

      if (!task) {
        return next(new errors.NotFoundError('unable to find task'));
      }
      res.send(200, task);
      return next();
    } catch (error) {
      return next(new errors.InternalServerError(error));
    }
  });

  server.post('/task', auth, async (req, res, next) => {
    if (!req.is('application/json')) {
      return next(new errors.InvalidContentError("This API expects: 'application/json'"));
    }

    const task = new Task({
      ...req.body,
      author: req.user._id,
    });

    try {
      await task.save();
      res.send(201, task);
      return next();
    } catch (error) {
      return next(new errors.InternalServerError());
    }
  });

  server.del('/task/:id', auth, async (req, res, next) => {
    try {
      await Task.deleteTask(req.user._id, req.params.id);
      res.send(200);
      return next();
    } catch (error) {
      return next(new errors.InternalServerError());
    }
  });

  server.patch('/task/:id', auth, async (req, res, next) => {
    if (!req.is('application/json')) {
      return next(new errors.InvalidContentError("This API expects: 'application/json'"));
    }

    const keys = Object.keys(req.body);
    const validKeys = ['completed', 'description', 'ratings'];

    const isBodyValid = keys.every((key) => validKeys.includes(key));

    if (!isBodyValid) {
      return next(new errors.BadRequestError('Please provide valid operation'));
    }

    try {
      const task = Task.findOne({ author: req.user._id, _id: req.params.id });

      validKeys.forEach((key) => task[key] = req.body[key]);
      await task.save();
      res.send(200, task);
      return next();
    } catch (error) {
      return next(new errors.InternalServerError());
    }
  });

  server.post('/task/upload/:id', auth, async (req, res, next) => {
    try {
      const file = req.body.data;
      const uploadRes = await cloudinary.uploader.upload(file, {
        upload_preset: process.env.CLOUDINARY_PRESET,
      });

      const task = await Task.findOne({ author: req.user._id, _id: req.params.id });
      const image = { url: uploadRes.secure_url, public_id: uploadRes.public_id };
      task.image = image;

      task.save();
      res.send(200);
      return next();
    } catch (error) {
      return next(new errors.InternalServerError());
    }
  });
}

module.exports = taskRouter;
