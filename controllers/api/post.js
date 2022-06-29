const router = require('express').Router();
const {Post, User, Comment} = require('../../models');
const sequelize = require('../../config/connections');
const auth = require('../../utils/auth');

// get all posts
router.get('/', (req, res) => {
    Post.findAll({
        attributes: ['id', 'title', 'post_text'],
        include: [{
            model: Comment,
            attributes: ['id', 'comment_text', 'post_id', 'user_id'],
            include: {
                model: User,
                attributes: ['username']
            }
        }, {
            model: User,
            attributes: ['username']
        }]
    })
    .then(dbpost => res.json(dbpost))
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    })
});

// get a single post
router.get('/:id', (req, res) => {
    Post.findOne({
        where: {
            id: req.params.id,
        },
        attributes: ['id', 'title', 'post_text'],
        include: [{
            model: User,
            attributes: ['username']
        }, {
            model: Comment,
            attributes: ['id', 'comment_text', 'post_id', 'user_id'],
            include: {
                model: User,
                attributes: ['userna,e']
            }
        }]
    })
    .then(dbpost => {
        if(!dbpost) {
            res.status(404).json({ message: 'id not not found'});
            return;
        }
        res.json(dbpost);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

// creating the post
router.post('/', auth, (req, res) => {
    Post.create({
        title: req.body.title,
        post_text: req.body.post_text,
        user_id: req.session.user_id
    })
    .then(dbpost => res.json(dbpost))
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    })
});

// updating a post
router.put('/:id', auth, (req, res) => {
    Post.update({
        title: req.body.title,
        post_text: req.body.post_text
    }, {
        where: {
            id: req.params.id
        }
    })
    .then(dbpost => {
        if(!dbpost) {
            res.status(404).json({ message: 'id not found'});
            return;
        }
        res.json(dbpost);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    })
});

// delating a post
router.delete('/:id', auth, (req, res) => {
    Post.destory({
        where: {
            id: req.params.id
        }
    })
    .then(dbpost => {
        if (!dbpost) {
            res.status(404).json({ message: 'id not found'});
            return;
        }
        res.json(dbpost);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    })
});

module.exports = router;