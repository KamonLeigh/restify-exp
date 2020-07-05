/* eslint-disable no-underscore-dangle */
const errors = require('restify-errors');
const Task = require('../models/task');
const { auth } = require('../middleware');

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
}

module.exports = taskRouter;
