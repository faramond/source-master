const winston = require('winston');
const mongoose = require('mongoose');
const config = require('config');
let option= { useNewUrlParser: true }

module.exports = function() {
  const db = config.get('db');
  mongoose.connect(db)
    .then(() => winston.info(`Connected to ${db},${option}...`));
}

