/* eslint-disable no-console */
const restify = require('restify');
const corsMiddleware = require('restify-cors-middleware');
const mongoose = require('mongoose');

const server = restify.createServer({ name: 'task-app' });

mongoose.connect('mongodb://localhost:27017/task-api', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});

const cors = corsMiddleware({
  origins: ['http://localhost:8090'],
});

server.pre((req, res, next) => {
  console.log(`${req.method}-${req.url}`);
  next();
});
server.pre(cors.preflight);
server.use(cors.actual);

server.pre(restify.plugins.pre.dedupeSlashes());
server.use(restify.plugins.bodyParser());
server.use(restify.plugins.queryParser());

require('./routes/test')(server);
require('./routes/userRoute')(server);
require('./routes/taskRoute')(server);

server.listen(8090, () => {
  console.info('app running on port');
});
