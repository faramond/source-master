const mongoose = require('mongoose');
const domain = require('./router/domains');
//const email = require('./router/email');
const payment = require('./router/payments');

const express = require('express');
const app = express();
mongoose.connect('mongodb://localhost/patel-portal')
    //mongoose.connect('mongodb://localhost/mirror-sense')
    .then(() => console.log('Connected to MongoDB...'))
    .catch(err => console.error('Could not connect to MongoDB...'));

app.use(express.json());
app.use('/patel/api/domain', domain);
app.use('/patel/api/payment', payment);
//app.use('/patel/api/email', email);
const port = process.env.PORT || 7000;
app.listen(port, () => console.log(`Listening on port ${port}...`));