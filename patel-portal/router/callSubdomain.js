// const querystring = require('qs');
const express = require('express');
const router = express.Router();
const https = require('https');

function postDomainRequest() {

}


//console.log('**************',postDomainRequest());

router.post('/ragister', (req, response) => {
    try {
        let domainName = req.body.domainName;
        let redData = [{
            type: 'A',
            name: req.body.domainName,
            data: "127.0.0.1",
            ttl: 1800
        }];
        console.log('wdasd', redData);
        // var patchData = JSON.stringify([{ "type": "CName", "name": "ranjan", "data": "184.168.131.241", "ttl": 1800 }]);
        var patchData = JSON.stringify(redData);
        console.log('test', patchData);
        var options =
        {
            hostname: 'api.godaddy.com',
            port: 443,
            path: '/v1/domains/fullblazeconsulting.co.za/records',
            method: 'PATCH',
            headers: {
                'Authorization': 'sso-key e4CVHF47FBSt_6LBmAPViks9qrBnbE1tW1H:6LBpunFVQYsYRiy8i9rBwH',
                'Content-Type': 'application/json',
                'Content-Length': patchData.length
            }

        };
        var req = https.request(options, (resp) => {
            console.log
            console.log('statusCode:', resp.statusCode);
            console.log('headers:', resp.headers);
            console.log('status:', resp.statusCode);
            if (resp.statusCode === 422) {
                response.status(resp.statusCode).contentType('application/json');
                response.send(
                    {
                        message: "domain not available",
                        suggestions: ['bhai' + domainName + 'patel.com', domainName + 'bhai.patel.com', domainName + '_patel.com']
                    }
                );
            }
            if (resp.statusCode === 200) {
                response.status(resp.statusCode).contentType('application/json');
                response.send(
                    {
                        message: 'Congratslations you have succesfully reqistered a domain ' + domainName + 'patel.com',
                        amount: "10USD",
                        term: " 1 Year",
                        modeOfInvoice: "email",
                        note: "Invoice sent to your registered email address",
                        offer: "Special offer for website hosting 100USD/Month",



                    }
                );
            }
            else
                resp.on('data', (d) => {
                    process.stdout.write(d);
                    response.status(resp.statusCode).contentType('application/json');
                    response.send(d);
                });

        });

        req.on('error', (e) => {
            console.log("error block");
            console.error(e);
        });

        console.log("patchdata block")
        req.write(patchData);
        req.end();

    }
    catch (err) {
        response.send({ 'message': err.message });
        console.log('Domain POST', err.message)
    }

});

router.get('/ragister', (req, resp) => {
    try
    {
        {
            var options =
            {
                hostname: 'api.godaddy.com',
                port: 443,
                path: '/v1/domains/fullblazeconsulting.co.za/records/A',
                method: 'GET',
                headers: {
                    'Authorization': 'sso-key e4CVHF47FBSt_6LBmAPViks9qrBnbE1tW1H:6LBpunFVQYsYRiy8i9rBwH',
                    'Content-Type': 'application/json',
                    
                }
        
            };
       let res=     https.get(options, (res) => {
                console.log('statusCode:', res.statusCode);
                console.log('headers:', res.headers);
              
                res.on('data', (d) => {
                  process.stdout.write(d);
                  resp.status(200).contentType('application/json').send(d);
                });
              
              }).on('error', (e) => {
                console.error(e);
              });
            
    }
}
    catch(err)
    {
        resp.send({ 'message': err.message });
        console.log('Get Subdomain List', err.message)
    }
    
   
});
module.exports = router