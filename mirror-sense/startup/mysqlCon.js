
const mysql = require('mysql');
const connection = mysql.createConnection({
    host: "103.57.190.72",
    port: 3306,
    database: "vnsense_salonpro",
    user: "vnsense_sa",
    password: "salonpro"
  });

  connection.connect(function (err) {
    if (err) {
      console.error('error connecting: ' + err.stack);
      return;
    }

    console.log('connected as id ' + connection.threadId);
  });



module.exports = connection;