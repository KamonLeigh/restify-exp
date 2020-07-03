const errors = require('restify-errors');
const Task = require('../models/task');
const { auth } = require('../middleware');

function taskRouter(server) {
  server.get('/tasks', auth, (req, res) => {
    res.send(200, 'hello');
  });
}

module.exports = taskRouter;
