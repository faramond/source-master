const express = require('express');
const customers = require('../routes/customers');
const bookings = require('../routes/bookings');
const services = require('../routes/services');
const salons = require('../routes/salons');
const login = require('../routes/login');
const auth = require('../routes/auth');
const home = require('../routes/home');
const verification = require('../routes/verification')
const error = require('../middleware/error');
const users = require('../controllers/users.js');


module.exports = function(app) {
  app.use(express.json());
  app.use('/mirror/api/customers', customers);
  app.use('/mirror/api/bookings', bookings);
  app.use('/mirror/api/services', services);
  app.use('/mirror/api/salons', salons);
  app.use('/mirror/api/registration', login);
  app.use('/mirror/api/auth', auth);
  app.use('/mirror/api', home);
  app.use('/uploads',express.static('./uploads'));
  app.use('/mirror/api/verification',verification);

  
  
  // app.use('/api/users', users);
  // app.use('/api/auth', auth);
  // app.use('/api/returns', returns);
  // app.use(error);
}

/**
 * Require user to be logged in and authenticated with 2FA
 *
 * @param req
 * @param res
 * @param next
 */
function requirePhoneVerification(req, res, next) {
  if (req.session.ph_verified) {
      console.log("Phone Verified");
      next();
  } else {
      console.log("Phone Not Verified");
      res.redirect("/verification");
  }
}