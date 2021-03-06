/* eslint-disable no-console */
const restify = require('restify');
const corsMiddleware = require('restify-cors-middleware');

const server = restify.createServer({ name: 'task-app' });
require('./db');

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

server.listen(process.env.PORT, () => {
  console.info('app running on port');
});
