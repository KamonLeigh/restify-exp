const errors = require('restify-errors');
const User = require('../models/user');
const { auth } = require('../middleware');

function userRouter(server) {
  server.post('/users', async (req, res, next) => {
    if (!req.is('application/json')) {
      return next(new errors.InvalidContentError("This API expects: 'application/json'"));
    }

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

  server.get('/users/me', auth, (req, res, next) => {
    res.send(200, req.user);
    return next();
  });

  server.post('/users/signout', auth, async (req, res, next) => {
    try {
      req.user.tokens = req.user.tokens.filter((token) => token.token !== req.token);
      await req.user.save();
      res.send();
      return next();
    } catch (error) {
      return next(new errors.InternalServerError());
    }
  });

  server.post('/user/signout/all', auth, async (req, res, next) => {
    try {
      req.user.tokens = [];
      await req.user.save();
      res.send();
      return next();
    } catch (error) {
      return next(new errors.InternalServerError());
    }
  });

  server.patch('/user/me', auth, async (req, res, next) => {
    if (!req.is('application/json')) {
      return next(new errors.InvalidContentError("This API expects: 'application/json'"));
    }

    const validKeys = ['forename', 'surname', 'username', 'password', 'email'];
    const updates = Object.keys(req.body);

    const isValidOperations = updates.every((key) => validKeys.includes(key));

    if (!isValidOperations) {
      return next(new errors.BadRequestError('Please provide valid operation'));
    }

    try {
      // eslint-disable-next-line no-return-assign
      updates.forEach((update) => req.user[update] = req.body[update]);
      await req.user.save();
      res.send(200, req.user);
      return next();
    } catch (error) {
      return next(new errors.BadRequestError(error.stack));
    }
  });

  server.delete('/user/me', auth, async (req, res, next) => {
    try {
      await req.user.remove();
      res.send(200, req.user);
      return next();
    } catch (error) {
      return next(new errors.InternalServerError(error.stack));
    }
  });
}

module.exports = userRouter;
