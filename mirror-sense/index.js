const mongoose = require('mongoose');
const customers = require('./routes/customers');
const bookings = require('./routes/bookings');
const services = require('./routes/services');
const salons = require('./routes/salons');
const login = require('./routes/login')
const home = require('./routes/home')

const express = require('express');
const app = express();
mongoose.connect('mongodb://localhost/mirror-sense_ews_poc')
//mongoose.connect('mongodb://localhost/mirror-sense')
    .then(() => console.log('Connected to MongoDB...'))
    .catch(err => console.error('Could not connect to MongoDB...'));

app.use(express.json());
app.use('/mirror/api/customers', customers);
app.use('/mirror/api/bookings', bookings);
app.use('/mirror/api/services', services);
app.use('/mirror/api/salons', salons);
app.use('/mirror/api/login', login);
app.use('/mirror/api', home);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));