/* eslint-disable no-console */
const restify = require('restify');
const mongoose = require('mongoose');

const server = restify.createServer({ name: 'task-app' });

mongoose.connect('mongodb://localhost:27017/task-api', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});

// const db = mongoose.connection;

// db.once('open', () => {
//  console.log("connect to database");
// });

server.pre((req, res, next) => {
  console.log(`${req.method}-${req.url}`);
  next();
});

server.use(restify.plugins.bodyParser());
server.use(restify.plugins.queryParser());

require('./routes/test')(server);
require('./routes/userRoute')(server);

server.listen(8090, () => {
  console.info('app running on port');
});
