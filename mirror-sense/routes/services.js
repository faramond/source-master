
const express = require('express');

const router = express.Router();

const salons =
    [
        { id: 101, name: 'hair' },
        { id: 102, name: 'nails' },
        { id: 103, name: 'beauty' },
        { id: 104, name: 'spa' }
    ];

    router.get('/', (req, resp) => {


    resp.send(salons);
}
);


module.exports = router; 