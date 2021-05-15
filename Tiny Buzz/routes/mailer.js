const { xxTinyBuzz_Content } = require("../Models/TinyBuzz_Content");
const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");

router.post("/", async (req, res) => {
    try {
        let d = new Date()
        d = JSON.stringify(d)
        d = JSON.parse(d)
        let date = d.substring(0, 10) + "T00:00:00.000Z";


        const news = await xxTinyBuzz_Content.find().and([{ created: { $gte: (date) } }])

        const notApproved = await xxTinyBuzz_Content.find().and({ isApproved: false }).and([{ created: { $gte: (date) } }]);

        const approved = await xxTinyBuzz_Content.find().and({ isApproved: true }).and([{ created: { $gte: (date) } }]);

        const mailTransport = nodemailer.createTransport({
            host: "smtpout.secureserver.net",
            secure: true,
            secureConnection: false, // TLS requires secureConnection to be false
            tls: {
                ciphers: 'SSLv3'
            },
            requireTLS: true,
            port: 465,
            debug: true,
            auth: {
                user: "shubham.singh@faramond.in",
                pass: "Welcome@2021"
            }
        });

        const mailOptions = {
            from: `shubham.singh@faramond.in`,
            to: `shubhamsingh228@gmail.com, sandeep.sharma@faramond.in`,
            subject: "Tiny Buzz: Today's news stats ",
            text: `Hello Sir,    
  
          Below is the Today's stats for the Tiny Buzz Application:
  
          Number of news posted today: ${news.length}
          Number of news pending for Approval: ${notApproved.length}
          Number of news Approved:  ${approved.length}

          Thank You,
          Support Team
          `,

        };

        mailTransport.sendMail(mailOptions).then(() => {
            console.log('Email sent successfully');
        }).catch((err) => {
            console.log('Failed to send email');
            console.error(err);
        });
        res.send({ count: news.length })

    } catch (err) {
        res.status(400).send({ message: err.message });
        console.log("mail Post", err.message);
    }
});

router.post("/reminder", async (req, res) => {
    try {
        let d = new Date()
        let date = d;
        date = date.setTime(date.getTime() - (6 * 60 * 60 * 1000));


        const news = await xxTinyBuzz_Content.find().and([{ created: { $gt: (date) } }, { created: { $lte: (d) } }])

        if (news.length == 0) {

            const mailTransport = nodemailer.createTransport({
                host: "smtpout.secureserver.net",
                secure: true,
                secureConnection: false, // TLS requires secureConnection to be false
                tls: {
                    ciphers: 'SSLv3'
                },
                requireTLS: true,
                port: 465,
                debug: true,
                auth: {
                    user: "shubham.singh@faramond.in",
                    pass: "Welcome@2021"
                }
            });

            const mailOptions = {
                from: `Tiny Buzz <noreply@tinybuzz.com>`,
                to: `shubhamsingh228@gmail.com`,
                subject: "Tiny Buzz: Alert!! No New News... ",
                /* text: `Hello Sir,    
   
           There is no new News Posted in Last 6 Hours. 
 
           Thank You,
           Support Team
           `,*/
                html: `<table style="border: 1px solid #333;">
                <thead>
                <th> login </th>
                <th> fte </th>
                </thead>
                <tr>
      <td> login </td>
      <td> fte </td>
      <td> start </td>
    </tr>`,

            };

            mailTransport.sendMail(mailOptions).then(() => {
                console.log('Email sent successfully');
            }).catch((err) => {
                console.log('Failed to send email');
                console.error(err);
            });
        }
        res.send({ count: news.length })

    } catch (err) {
        res.status(400).send({ message: err.message });
        console.log("mail Post", err.message);
    }
});



module.exports = router;
