const express = require('express');
const customers = require('../routes/customers');
const bookings = require('../routes/bookings');
const services = require('../routes/services');
const salons = require('../routes/salons');
const login = require('../routes/login');
const auth = require('../routes/auth');
const home = require('../routes/home');
const populate = require('../routes/populate');
const hot = require('../routes/hot');
const star = require('../routes/mirrorStar');
const payment = require('../routes/payment');
const reward = require('../routes/reward');
const wallet = require('../routes/wallet');
const happening = require('../routes/happening');
const verification = require('../routes/verification')
const setting = require('../routes/settings')
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
  app.use('/mirror/api/data', populate);
  app.use('/mirror/api/hot', hot);
  app.use('/mirror/api/star', star);
  app.use('/uploads',express.static('./uploads'));
  app.use('/mirror/api/verification',verification);
  app.use('/mirror/api/payment', payment);
  app.use('/mirror/api/reward', reward);
  app.use('/mirror/api/wallet', wallet);
  app.use('/mirror/api/happening', happening);
  app.use('/mirror/api/setting', setting);

  
  
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