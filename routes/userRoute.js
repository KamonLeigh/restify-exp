const User = require('../models/user');

function userRouter(server) {
  server.post('/users', async (req, res) => {
    const user = new User(req.body);

    try {
      await user.save();
      const token = await user.generateToken();

      res.send(201, { user, token });
    } catch (error) {
      res.status(400).send(error);
    }
  });
}

module.exports = userRouter;
