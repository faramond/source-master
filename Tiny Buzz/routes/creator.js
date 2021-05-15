const { xxTinyBuzz_User } = require("../Models/TinyBuzz_user");
const express = require("express");
const router = express.Router();
const _ = require('lodash');
const bcrypt = require('bcrypt');
const upload = require("../storage/image");

router.post("/login", async (req, res) => {
  try {
    let user = await xxTinyBuzz_User.findOne({ email: { $regex: new RegExp(req.body.email, "i") } });
    if (!user)
      return res.status(400).send({ message: "Invalid userName or password." });
    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!validPassword)
      return res.status(400).send({ message: "Invalid userName or password." });
    res
      .status(201)
      .send(
        _.pick(user, [
          "_id",
          "fullname",
          "email",
          "role",
          "image",
          "created",
          "updated",
        ])
      );
  } catch (err) {
    res.status(400).send({ message: err.message });
    console.log("Auth Post", err.message);
  }
});

router.post("/", upload.single('image'), async (req, res) => {
  try {
    let user = await xxTinyBuzz_User.findOne({ email: req.body.email });
    if (user)
      return res.status(400).send({ message: "email already registered." });
    if (req.body.email === undefined) return req.send({ "message": "email required" })
    if (req.file == undefined) {
      user = new xxTinyBuzz_User({
        fullname: req.body.fullname,
        role: req.body.role,
        password: req.body.password,
        email: req.body.email
      }
      );
    }
    else {
      user = new xxTinyBuzz_User({
        fullname: req.body.fullname,
        role: req.body.role,
        image: req.file.path,
        password: req.body.password,
        email: req.body.email
      }
      );

    }
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    await user.save();
    res.status(201).send(_.pick(user, [
      "_id",
      "role",
      "fullname",
      "image",
      "email",
    ])
    );
  } catch (err) {
    res.status(400).send({ message: err.message });
    console.log("Login Post", err.message);
  }
});


router.patch('/:id', upload.single('image'), async (req, res) => {
  try {

    if (req.file == undefined) {
      const creator = await xxTinyBuzz_User.findByIdAndUpdate(req.params.id,
        {
          fullname: req.body.fullname,
          role: req.body.role,
          email: req.body.email,
          updated: new Date(),

        }, { new: true });

      if (!creator) return res.status(404).send({ 'message': 'The creator with the given ID was not found.' });

      res.status(200).send(creator);

    }

    else {
      const creator = await xxTinyBuzz_User.findByIdAndUpdate(req.params.id,
        {
          fullname: req.body.fullname,
          role: req.body.role,
          image: req.file.path,
          email: req.body.email,
          updated: new Date(),

        }, { new: true });

      if (!creator) return res.status(404).send({ 'message': 'The creator with the given ID was not found.' });

      res.status(200).send(creator);
    }




  }

  catch (err) {
    res.status(400).send({ 'message': err.message });
    console.log('creator Patch', err.message)
  }

})

router.get('/', async (req, res) => {
  try {



    const creator = await xxTinyBuzz_User.find().select({ _id: 1, fullname: 1, email: 1, image: 1, role: 1 })
    res.status(200).send(creator);
  }

  catch (err) {
    res.status(400).send({ 'message': err.message });
    console.log('creator Get', err.message)
  }

});

router.patch('/change/Password', async (req, res) => {
  try {
    console.log(req.query.email, req.body.password)

    let password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    password = await bcrypt.hash(password, salt);

    const id = await xxTinyBuzz_User.findOne({ email: req.query.email }).select({ _id: 1 });
    if (!id) return res.status(400).send({ 'message': "Invalid E-Mail" })


    const creator = await xxTinyBuzz_User.findByIdAndUpdate(id._id,
      {
        password: password,
        updated: new Date(),

      }, { new: true });

    if (!creator) return res.status(404).send({ 'message': 'The creator with the given ID was not found.' });

    res.status(200).send(creator);


  }
  catch (err) {
    res.status(400).send({ 'message': err.message });
    console.log('change password', err.message)
  }

});

router.delete("/:id", async (req, res) => {
  try {
    const creator = await xxTinyBuzz_User.findByIdAndRemove(req.params.id);

    if (!creator)
      return res
        .status(404)
        .send({ message: "The creator with the given ID was not found." });

    res.send(creator);

  } catch (err) {
    res.send({ message: err.message });
  }
});


module.exports = router;
