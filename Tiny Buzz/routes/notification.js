const express = require("express");
const router = express.Router();

var FCM = require('fcm-node');
var serverKey = 'AAAA8QfTdnA:APA91bFthOoZZlrYid1h2wh5UZuonEMFyLqgdeM6OAczFfsahPXUhFggHU1ku4X3ImlppoLjUxOReCHYdbrc0ESbRnd3Gqy9u2cs9S8c8-gzoYd5r-nNEdLi5pxnSl5WWZB-m3pyZyDt'; 
var fcm = new FCM(serverKey);
 

 router.post("/subscribe", async (req, res) => {
     console.log(req.body.token,req.body.topic)
    try {
    fcm.subscribeToTopic([ req.body.token ], 
    req.body.topic, (err, ress) => {
   if (err) {
             console.log('subscribe topic', err.message)
             return res.status(400).send({ 'message': err.message });
            };
    res.send(ress);
     });
    } catch (err) {
        res.status(400).send({ message: err.message });
        console.log("subscribe topic", err.message);
    }
});

router.post("/UnSubscribe", async (req, res) => {
    try {
    fcm.unsubscribeToTopic([ req.body.token ], 
    req.body.topic, (err, ress) => {
   if (err) {
             console.log('subscribe topic', err.message)
             return res.status(400).send({ 'message': err.message });
            };
    res.send(ress);
     });
    } catch (err) {
        res.status(400).send({ message: err.message });
        console.log("subscribe topic", err.message);
    }
});

module.exports = router;