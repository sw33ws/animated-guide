const router = require('express').Router();
const { User, Post, Comment} = require('../../models');
const Auth = require('../../utils/auth');

// getting all comments
router.get('/', (req, res) => {
    Comment.findAll()
    .then((dbComment) => res.json(dbComment))
    .catch((err) => {
        console.log(err);
        res.status(500).json(err);
    })
});

// creating a comment and adding it to the database
router.post('/', Auth, (req, res) => {
    if (req.session) {
        Comment.create({
            comment_text: req.body.comment_text,
            post_id: req.body.post_id,
            user_id: req.session.user_id
        })
        .then(dbComment => res.json(dbComment))
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        })
    }
});

module.exports = router;