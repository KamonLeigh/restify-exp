const errors = require('restify-errors');
const Task = require('../models/task');
const User = require('../models/user');
const { auth } = require('../middleware');

function taskRouter(server) {
  server.get('/tasks', auth, (req, res) => {

    //res.send(200, 'hello');
  });
}

module.exports = taskRouter;
