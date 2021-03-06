const mongoose = require('mongoose');
const express = require('express');
const app = express();

require('./startup/routes')(app);

mongoose.connect('mongodb://shubham:Dev%402020@localhost/tinybuzz')
    .then(() => console.log('Connected to MongoDB...'))
    .catch(err => console.error('Could not connect to MongoDB...', err));

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));