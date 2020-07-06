const { Employee } = require('../models/employee');
const { Booking } = require('../models/booking');
const { Salary } = require('../models/salary');
const { Post } = require('../models/post');
const { Leave } = require('../models/leave');
const { MirrorStar } = require('../models/mirrorStar');
const { Notification } = require('../models/notification');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = require('../storage/image');
const moment = require("moment");

let data;
router.get('/', async (req, res) => {
    try {
        let isLiked = false;

        let queryString = req.query.mobileNumber

        let post = await Post.find().or([{ mobileNumber: req.query.mobileNumber }, { mirrorstar: req.query.mirrorstar }, { employee: req.query.employee }])
            .select({ fullName: 1, image: 1, created: 1, description: 1, photos: 1, likes: 1, comments: 1, likeCounter: 1, commentCounter: 1 })
            .sort({ created: -1 });
        if (post != "" && post != [] && post != null) {
            for (i = 0; i < post.length; i++) {
                if (post[i].likes != "" && post[i].likes != [] && post[i].likes != null) {
                    for (j = 0; j < post[i].likes.length; j++) {
                        if (post[i].likes[j].mirrorStar === req.query.mirrorstar) {
                            isLiked = true;
                        }
                    }
                }
                post[i] = JSON.stringify(post[i]);
                post[i] = JSON.parse(post[i]);
                post[i].isLiked = isLiked;
            }
        }

        res.send(post);
    }

    catch (err) {
        res.send({ 'message': err.message });
    }

});
router.get('/all', async (req, res) => {
    try {
        let isLiked = false;

        let queryString = req.query.mobileNumber

        const post = await Post.find()
            .select({ fullName: 1, image: 1, created: 1, description: 1, photos: 1, likes: 1, comments: 1, likeCounter: 1, commentCounter: 1 })
            .sort({ created: -1 });

        if (post != "" && post != [] && post != null) {
            for (i = 0; i < post.length; i++) {
                if (post[i].likes != "" && post[i].likes != [] && post[i].likes != null) {
                    for (j = 0; j < post[i].likes.length; j++) {
                        if (post[i].likes[j].mirrorStar === req.query.mirrorstar) {
                            isLiked = true;
                        }
                    }
                }
                post[i] = JSON.stringify(post[i]);
                post[i] = JSON.parse(post[i]);
                post[i].isLiked = isLiked;
            }
        }


        res.send(post);
    }

    catch (err) {
        res.send({ 'message': err.message });
    }

});
router.patch('/:id', upload.array('photos'), async (req, res) => {
    try {
        let pics = [];
        let data = JSON.parse(req.body.unchanged);


        for (i = 0; i < req.files.length; i++)
            pics.push(req.files[i].path);

        for (i = 0; i < data.length; i++)
            pics.push(data[i]);

        let post = await Post.findByIdAndUpdate(req.params.id,
            {
                fullName: req.body.fullName,
                description: req.body.description,
                photos: pics,
                created: new Date()

            }, { new: true });
        if (!post) return res.status(404).send({ 'message': 'Post not found.' });

        res.send(post);
    }
    catch (err) {
        res.send({ 'message': err.message });
    }

});

router.delete('/:id', async (req, res) => {
    try {
        const post = await Post.findByIdAndRemove(req.params.id);

        if (!post) return res.status(404).send({ 'message': 'The post with the given ID was not found.' });

        res.send(post);

    }
    catch (err) {
        res.send({ 'message': err.message });
    }
});


router.post('/', upload.array('photos'), async (req, res) => {

    try {
        let imageData = await MirrorStar.findOne({ _id: req.body.mirrorstar }).select({ image: 1 });

        let pics = [];
        for (i = 0; i < req.files.length; i++)
            pics.push(req.files[i].path);
        let post = new Post({
            fullName: req.body.fullName,
            mobileNumber: req.body.mobileNumber,
            description: req.body.description,
            employee: req.body.employee,
            mirrorstar: req.body.mirrorstar,
            photos: pics,
            image: imageData.image
        });
        post = await post.save();
        res.send(post);
    }
    catch (err) {
        res.send({ 'message': err.message });
    }

}
);

router.patch('/likes/:id', async (req, res) => {

    let flag = false;

    try {
        console.log(req.query.mirrorStar, "m");
        let check = await Post.find({ _id: req.params.id }).select({ likes: 1 });
        if (check != [] && check != "" && check != null) {
            for (i = 0; i < check[0].likes.length; i++) {
                console.log(check[0].likes[i].mirrorStar, "k");
                if ((check[0].likes.length != 0) && (check[0].likes[i].mirrorStar == req.query.mirrorStar)) {
                    let post = await Post.findByIdAndUpdate(req.params.id,
                        {
                            $pull: { likes: { mirrorStar: req.query.mirrorStar } },

                            $inc: { likeCounter: -1 }
                        },
                    );
                    if (!post) return res.status(404).send({ 'message': 'post not found' });

                    flag = true
                    res.send({ 'message': 'post unliked' });
                    //res.send(post);
                    break;
                }
            }
        }
        if (flag == false) {
            let starName = await MirrorStar.findOne({ _id: req.query.mirrorStar }).select({ starName: 1 });
            let image = await MirrorStar.findOne({ _id: req.query.mirrorStar }).select({ image: 1 });
            let post = await Post.findByIdAndUpdate(req.params.id,
                {
                    $addToSet: {
                        likes: {
                            name: starName.starName,
                            image: image.image,
                            mirrorStar: req.query.mirrorStar
                        },
                    },
                    $inc: { likeCounter: 1 }
                },

                { new: true });
            if (!post) return res.status(404).send({ 'message': 'post not found' });


            res.send({ 'message': 'post liked' });

        }
    }

    catch (err) {
        res.send({ 'message': err.message });
    }

});


router.patch('/comments/:id', async (req, res) => {
    try {
        let temp = (req.body.comment);
        let starName = await MirrorStar.findOne({ _id: req.query.mirrorStar }).select({ starName: 1 });
        let image = await MirrorStar.findOne({ _id: req.query.mirrorStar }).select({ image: 1 });

        let post = await Post.findByIdAndUpdate(req.params.id,
            {
                $addToSet: {
                    comments: {
                        name: starName.starName,
                        image: image.image,
                        mirrorStar: req.query.mirrorStar,
                        comment: temp
                    }

                },
                $inc: { commentCounter: 1 }
            }, { new: true });
        if (!post) return res.status(404).send({ 'message': 'Post not found.' });
        res.send(post);
    }
    catch (err) {
        res.send({ 'message': err.message });
    }

});

router.patch('/deleteComments/:id', async (req, res) => {
    try {

        let post = await Post.findByIdAndUpdate(req.params.id,
            {
                $pull: { comments: { _id: req.query.commentID } },


                $inc: { commentCounter: -1 }
            }, { new: true });
        if (!post) return res.status(404).send({ 'message': 'Post not found.' });
        res.send({ 'message': 'comment deleted.' });
    }
    catch (err) {
        res.send({ 'message': err.message });
    }

});
router.get('/comments/:id', async (req, res) => {
    try {
        isCommented = false;
        currentDate = new Date();
        timeStamp = String;

        let post = await Post.findOne().or([{ _id: req.params.id }])
            .select({ comments: 1 })

        if (post != "" && post != [] && post != null) {

            if (post.comments != "" && post.comments != [] && post.comments != null) {
                for (j = 0; j < post.comments.length; j++) {
                    if (post.comments[j].mirrorStar === req.query.mirrorstar) {
                        isCommented = true;
                    }

                    let date = post.comments[j].created;
                    let duration = moment(date).fromNow();


                    post.comments[j] = JSON.stringify(post.comments[j]);
                    post.comments[j] = JSON.parse(post.comments[j]);
                    post.comments[j].isCommented = isCommented;
                    post.comments[j].timeStamp = duration;
                }
            }


        }


        res.send(post);
    }

    catch (err) {
        res.send({ 'message': err.message });
    }

});

module.exports = router;