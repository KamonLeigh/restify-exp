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
}

module.exports = userRouter;
