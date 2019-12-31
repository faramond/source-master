require('dotenv').config({path:'.env'});
require('./models/user_model')
const winston = require('winston');
const mysql = require('mysql')


const express = require('express');
const app = express();
//mongoose.connect('mongodb://localhost/mirror-sense_ews_poc')
require('./startup/logging')();
require('./startup/routes')(app);
require('./startup/db')();
require('./startup/config')();
require('./startup/validation')();

const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const expressSession = require('express-session');
const mongoStore = require('connect-mongo')({session: expressSession});
const mongoose = require('mongoose');

const config = require('./config.js');

if(!config.API_KEY){
    console.log("Please set your ACCOUNT_SECURITY_API_KEY environment constiable before proceeding.");
    process.exit(1);
}


const dataBase = mongoose.connection;
   dataBase.once('open', function (err) {
      if(err){
          console.log("Error Opening the DB Connection: ", err);
          return;
      }
      app.use(expressSession({
          secret: config.SECRET,
          cookie: {maxAge: 60 * 60 * 1000},
          store: new mongoStore({
              db: mongoose.connection.db,
              collection: 'sessions'
          }),
          resave: true,
          saveUninitialized: true
      }));
      // const port = config.PORT || 5151;
      // server.listen(port);
      // console.log("Magic happening on port " + port);
    });
    
    dataBase.on('error', console.error.bind(console, 'Connection Error:'));

app.use(cookieParser());
app.use(
    expressSession(
        {
            'secret': config.SECRET,
            resave: true,
            saveUninitialized: true
        }
    )
);

app.use(bodyParser.json({}));
app.use(bodyParser.urlencoded({
    extended: true
}));

process
  .on('unhandledRejection', (reason, p) => {
    console.error(reason, 'Unhandled Rejection at Promise', p);
  })
  .on('uncaughtException', err => {
    console.error(err, 'Uncaught Exception thrown');
    //process.exit(1);
  });
const port = process.env.PORT1 || 3000;
const server = app.listen(port, () => winston.info(`Listening on port ${port}...`));



module.exports = server;
