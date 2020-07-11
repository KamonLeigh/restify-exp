/* eslint-disable no-underscore-dangle */
const jwt = require('jsonwebtoken');
const errors = require('restify-errors');
const User = require('../models/user');

module.exports = {
  auth: async (req, res, next) => {
    try {
      const token = req.header('Authorization').replace('Bearer ', '');
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findOne({ _id: decoded._id, 'tokens.token': token });

      if (!user) {
        return next(new errors.UnauthorizedError('invalid request'));
      }
      req.token = token;
      req.user = user;
      return next();
    } catch (error) {
      return next(new errors.UnauthorizedError('please authenticate '));
    }
  },
};
