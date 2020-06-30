// const errors = require('re')
const User = require('../models/user');

function userRouter(server) {
  server.post('/users', async (req, res) => {
    const user = new User(req.body);

    try {
      await user.save();
      const token = await user.generateToken();

      res.send(201, { user, token });
    } catch (error) {
      res.send(400, error);
    }
  });
}

module.exports = userRouter;
