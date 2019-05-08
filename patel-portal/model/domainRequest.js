const request = require('request');
 
_EXTERNAL_URL = 'https://api.godaddy.com/v1/domains/fullblazeconsulting.co.za/records';

const calldomainRequest = (callback) => {
    request(_EXTERNAL_URL, { json: true }, (err, res, body) => {
    if (err) { 
        return callback(err);
     }
    return callback(body);
    });
}

module.exports.callApi = calldomainRequest;