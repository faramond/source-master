const cron = require("node-cron");
let shell = require("shell.js");

cron.job('* * * * *', () => {
    console.log('sheduler running....');
    if (shell.exec('http://159.89.155.62:3000/mirror/api/salons/sync').code !== 0) {
        console.log("error happened");
    }

});