
const express = require('express');
//const { mysqlCon} = require('../startup/db');

const router = express.Router();

const salons =
    [
        { id: 3, name: 'hair' },
        { id: 1, name: 'nails' },
        { id: 2, name: 'beauty' },
        { id: 4, name: 'spa' }
    ];

    router.get('/', (req, resp) => {


    resp.send(salons);
}
);


module.exports = router; 