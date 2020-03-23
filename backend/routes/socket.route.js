const express = require('express');
const app = express();
const socketRoute = express.Router();


let Socket = require('../models/SocketModel');

// Add Coordinates
socketRoute.route('/add').post((req, res, next) => {
  Navigation.create(req.body, (error, data) => {
    if (error) {
      return next(error)
    } else {
      res.json(data)
    }
  })
});

module.exports = socketRoute;