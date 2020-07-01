const errors = require('restify-errors');
const User = require('../models/user');

function userRouter(server) {
  server.post('/users', async (req, res, next) => {
    const user = new User(req.body);

    try {
      await user.save();
      const token = await user.generateToken();
      res.send(201, { user, token });
      return next();
    } catch (error) {
      return next(new errors.BadRequestError(error));
    }
  });
  server.post('/users/signin', async (req, res, next) => {
    if (!req.is('application/json')) {
      return next(new errors.InvalidContentError("This API expects: 'application/json'"));
    }

    try {
      const user = await User.findByCredentials(req.body.email, req.body.password);
      const token = await user.generateToken();
      res.send(200, { user, token });
      return next();
    } catch (error) {
      return next(new errors.BadRequestError(error));
    }
  });
}

module.exports = userRouter;
