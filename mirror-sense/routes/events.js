const { Events } = require('../models/events');
const { MirrorStar } = require('../models/mirrorStar');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = require('../storage/image');
const { createNewConnection } = require('../lib/connection');
const { createNewConnection2 } = require('../lib/connection');



/*router.get('/', async (req, res) => {
    try {
        
        const events = await Events.find().sort('dateFrom');
        res.send(events);
    }
    
    catch (err) {
        res.send({ 'message': err.message });
        console.log('events', err.message)
    }

});*/

router.get('/', async (req, res) => {
  try {
    let con = createNewConnection();
    let response = [];

    con.getConnection(function (err, connection) {
      if (err) {
        console.log(' get events', err.message)
        return res.status(400).send({ 'message': err.message });
      };
      console.log("Connected!");
      var sql = "Select EducationCourseID, CourseName, CourseDate ,ClosingDate , Address, Price, HeaderLocation from EducationCourse where IsEvent = 1";
      connection.query(sql, function (err, result, fields) {
        if (err) {
          console.log(' get events', err.message)
          return res.status(400).send({ 'message': err.message });
        };
        console.log("fetch successful");
        connection.release();

        if (result != [] && result != "" && result != null) {
          for (i = 0; i < result.length; i++) {
            temp = {
              _id: result[i].EducationCourseID,
              courseName: result[i].CourseName,
              dateFrom: result[i].CourseDate,
              dateTo: result[i].ClosingDate,
              address: result[i].Address,
              description: result[i].Description,
              price: result[i].Price,
              logo: result[i].HeaderLocation
            }
            response.push(temp);
          }
          res.send(response);

        }

        else {

          res.send({ 'message': 'event is not available ' });
        }
      });


    });
  }

  catch (err) {
    res.send({ 'message': err.message });
    console.log('events', err.message)
  }

});

router.get('/details/:id', async (req, res) => {
  try {
    let con = createNewConnection();
    let conn = await createNewConnection2();
    let StylistID = parseInt(req.query.StylistID);
    id = parseInt(req.params.id);
    let images = [];
    isPurchased = false;
    let response;

    con.getConnection(function (err, connection) {
      if (err) {
        console.log('events details', err.message)
        return res.status(400).send({ 'message': err.message });
      };
      console.log("Connected!");
      var sql_1 = "Select Location from EducationCourseImage where EducationCourseID = ?";
      var sql = "Select  EducationCourseID, CourseName, CourseDate ,ClosingDate ,Description, Address, Price from EducationCourse where EducationCourseID = ?";
      connection.query(sql, [id], async function (err, result, fields) {
        if (err) {
          console.log('events details', err.message)
          return res.status(400).send({ 'message': err.message });
        };
        console.log("fetch successful");

        if (result != [] && result != "" && result != null) {
          let [rows, fields_1] = await conn.execute(sql_1, [id]);
          if (rows != [] && rows != "" && rows != null) {
            for (j = 0; j < rows.length; j++) {
              images.push(rows[j].Location);
            }
            response = {
              _id: result[0].EducationCourseID,
              courseName: result[0].CourseName,
              dateFrom: result[0].CourseDate,
              dateTo: result[0].ClosingDate,
              address: result[0].Address,
              description: result[0].Description,
              price: result[0].Price,
              image: images
            }
          }

          else {
            response = {
              _id: result[0].EducationCourseID,
              courseName: result[0].CourseName,
              dateFrom: result[0].CourseDate,
              dateTo: result[0].ClosingDate,
              address: result[0].Address,
              description: result[0].Description,
              price: result[0].Price,
              image: ""
            }



          }
          /*let event = await MirrorStar.findOne({ _id: req.query._id })
            .select({ events: 1 })
          if (event != [] && event != "" && event != null) {
            for (key in event.events) {
              if (id == event.events[key]) {
                isPurchased = true;
                break;
              }

            }
          }*/
          response.isPurchased = false;
          res.send(response);


          if (!isPurchased) {

            var sql_2 = "Select ViewCourseID  from ViewCourse where StylistID = ?";
            connection.query(sql_2, [StylistID], function (err, result_2, fields_2) {
              if (err) {
                console.log('events details', err.message)
                return res.status(400).send({ 'message': err.message });
              };
              console.log("fetch successful");
              if (result_2 == [] || result_2 == "" || result_2 == null) {
                var sql_3 = "Insert into ViewCourse (EducationCourseID, StylistID, blnInterested) VALUES (?,?,?)";
                connection.query(sql_3, [id, StylistID, 1], function (err, result_3, fields_3) {
                  if (err) {
                    console.log('events details', err.message)
                    return res.status(400).send({ 'message': err.message });
                  };
                  console.log("fetch successful");
                });
              }
              else {
                let flag = false;
                for (let key in result_2) {
                  if (id == result_2[key].ViewCourseID) {
                    flag = true;
                    break;

                  }
                }
                if (!flag) {
                  var sql_3 = "Insert into ViewCourse (EducationCourseID, StylistID, blnInterested) VALUES (?,?,?)";
                  connection.query(sql_3, [id, StylistID, 1], function (err, result_3, fields_3) {
                    if (err) {
                      console.log('events details', err.message)
                      return res.status(400).send({ 'message': err.message });
                    };
                    console.log("fetch successful");

                  });
                }

              }
              connection.release();
            });
          }

        }

        else {
          connection.release();
          res.send({ 'message': 'event is not available ' });
        }

      });


    });
  }

  catch (err) {
    res.send({ 'message': err.message });
    console.log('events', err.message)
  }

});

router.post('/', upload.single('image'), async (req, res) => {
  console.log(req);

  console.log(req.file);
  try {
    let events = new Events({
      courseName: req.body.courseName,
      dateFrom: req.body.dateFrom,
      dateTo: req.body.dateTo,
      venue: req.body.venue,
      address: req.body.address,
      description: req.body.description,
      price: req.body.price,
      image: req.file.path
    });
    events = await events.save();

    res.send(events);
  }
  catch (err) {
    res.send({ 'message': err.message });
    console.log('events Post', err.message)
  }

}
);


router.patch('/:id', async (req, res) => {
  try {
    let event = await Events.findByIdAndUpdate(req.params.id,
      {
        $addToSet: { registeredEmployee: req.body.registeredEmployee }

      }, { new: true });
    if (!event) return res.status(404).send({ 'message': 'event not found.' });

    res.send(event);
  }
  catch (err) {
    res.send({ 'message': err.message });
    console.log('event', err.message)
  }
});



router.patch('/register/:id', async (req, res) => {
  try {
    let mirrorstar = await MirrorStar.findByIdAndUpdate(req.params.id,
      {
        $addToSet: { events: req.body.events }

      }, { new: true });
    if (!mirrorstar) return res.status(404).send({ 'message': 'mirrorstar not found.' });

    res.send(mirrorstar);
  }
  catch (err) {
    res.send({ 'message': err.message });
    console.log('mirrorstar', err.message)
  }


});

router.get('/s', async (req, res) => {
  try {



    const event = await MirrorStar.find({ _id: request.params._id })

    res.send(event);
  }

  catch (err) {
    res.send({ 'message': err.message });
    console.log('Leave History', err.message)
  }

});

module.exports = router;