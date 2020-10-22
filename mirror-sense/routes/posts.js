const { Post } = require('../models/post');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = require('../storage/image');
const moment = require("moment");
const { createNewConnection } = require('../lib/connection');

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

        res.status(200).send(post);
    }

    catch (err) {
        res.status(400).send({ 'message': err.message });
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


        res.status(200).send(post);
    }

    catch (err) {
        res.status(400).send({ 'message': err.message });
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

        res.status(200).send(post);
    }
    catch (err) {
        res.status(400).send({ 'message': err.message });
    }

});

router.delete('/:id', async (req, res) => {
    try {
        const post = await Post.findByIdAndRemove(req.params.id);

        if (!post) return res.status(404).send({ 'message': 'The post with the given ID was not found.' });

        res.status(200).send(post);

    }
    catch (err) {
        res.status(400).send({ 'message': err.message });
    }
});


router.post('/', upload.array('photos'), async (req, res) => {

    try {
        let con = createNewConnection();
        let ID = parseInt(req.body.mirrorstar)
        let image = ""
        con.getConnection(async function (err, connection) {
            if (err) {
                console.log('booking get error', err.message)
                return res.status(400).send({ 'message': err.message });

            };
            var sql = "Select PhotoDir as image from Employee where StylistID = ?";
            connection.query(sql, [ID], async function (err, result, fields) {
                if (err) {
                    console.log('booking get error', err.message)
                    return res.status(400).send({ 'message': err.message });

                };
                if (result != [] && result != "" && result != null) {
                    image = result[0].image
                }
                else {
                    return res.status(400).send({ 'message': 'star not found in post post' });
                }

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
                    image: image
                });
                post = await post.save();
                res.status(200).send(post);

            })
            connection.release();


        });
    }
    catch (err) {
        res.status(400).send({ 'message': err.message });
    }

}
);

router.patch('/likes/:id', async (req, res) => {

    let flag = false;

    try {
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
                    res.status(200).send({ 'message': 'post unliked' });
                    //res.send(post);
                    break;
                }
            }
        }
        if (flag == false) {
            let con = createNewConnection();
            let ID = parseInt(req.query.mirrorStar)
            let image = "";
            let starName = "";
            con.getConnection(async function (err, connection) {
                if (err) {
                    console.log('booking get error', err.message)
                    return res.status(400).send({ 'message': err.message });

                };
                var sql = "Select HeaderImage as image,FullName as starName from Employee where StylistID = ?";
                connection.query(sql, [ID], async function (err, result, fields) {
                    if (err) {
                        console.log('booking get error', err.message)
                        return res.status(400).send({ 'message': err.message });

                    };
                    if (result != [] && result != "" && result != null) {
                        image = result[0].image
                        starName = result[0].starName
                    }
                    else {
                        return res.status(400).send({ 'message': 'star not found in post like ' });
                    }
                    let post = await Post.findByIdAndUpdate(req.params.id,
                        {
                            $addToSet: {
                                likes: {
                                    name: starName,
                                    image: image,
                                    mirrorStar: req.query.mirrorStar
                                },
                            },
                            $inc: { likeCounter: 1 }
                        },

                        { new: true });
                    if (!post) return res.status(404).send({ 'message': 'post not found' });


                    res.status(200).send({ 'message': 'post liked' });
                })
                connection.release();


            });

        }

    }

    catch (err) {
        res.status(201).send({ 'message': err.message });
    }

});


router.patch('/comments/:id', async (req, res) => {
    try {
        let con = createNewConnection();
        let ID = parseInt(req.query.mirrorStar)
        let image = "";
        let starName = "";
        con.getConnection(async function (err, connection) {
            if (err) {
                console.log('booking get error', err.message)
                return res.status(400).send({ 'message': err.message });

            };
            var sql = "Select HeaderImage as image,FullName as starName from Employee where StylistID = ?";
            connection.query(sql, [ID], async function (err, result, fields) {
                if (err) {
                    console.log('booking get error', err.message)
                    return res.status(400).send({ 'message': err.message });

                };
                if (result != [] && result != "" && result != null) {
                    image = result[0].image
                    starName = result[0].starName
                }
                else {
                    return res.status(400).send({ 'message': 'star not found in post comment ' });
                }
                let temp = (req.body.comment);

                let post = await Post.findByIdAndUpdate(req.params.id,
                    {
                        $addToSet: {
                            comments: {
                                name: starName,
                                image: image,
                                mirrorStar: req.query.mirrorStar,
                                comment: temp
                            }

                        },
                        $inc: { commentCounter: 1 }
                    }, { new: true });
                if (!post) return res.status(404).send({ 'message': 'Post not found.' });
                res.status(200).send(post);
            })
            connection.release();


        });
    }
    catch (err) {
        res.status(201).send({ 'message': err.message });
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
        res.status(200).send({ 'message': 'comment deleted.' });
    }
    catch (err) {
        res.status(400).send({ 'message': err.message });
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


        res.status(200).send(post);
    }

    catch (err) {
        res.status(400).send({ 'message': err.message });
    }

});

module.exports = router;