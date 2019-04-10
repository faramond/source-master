
const express = require('express');

const router = express.Router();
router.get('/', (req, resp) => {
    resp.send({'message':'Welcome to the mirror Powered by Faramond technologies'});
}
);


module.exports = router; 