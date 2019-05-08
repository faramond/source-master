//const mongoose = require('mongoose');
const callSubdomain = require('./router/callSubdomain');


const express = require('express');
const app = express();
//mongoose.connect('mongodb://localhost/mirror-sense_ews_poc')
// //mongoose.connect('mongodb://localhost/mirror-sense')
//     .then(() => console.log('Connected to MongoDB...'))
//     .catch(err => console.error('Could not connect to MongoDB...'));

app.use(express.json());
app.use('/patel/api/domain', callSubdomain);
const port = process.env.PORT || 7000;
app.listen(port, () => console.log(`Listening on port ${port}...`));