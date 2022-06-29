const router = require('express').Router();
const sequelize = require('../config/connection');
const { Post, User, Comment } = require('../models');

// setting up the home page
router.get('/', (req, res) => {
    Post.findAll({
        attributes: ['id', 'title', 'post_text'],
        include: [{
            model: Comment,
            attributes: ['id', 'user_id', 'post_id', 'comment_text'],
            include: {
                model: User,
                attributes: ['Username']
            }
        }, {
            model: User,
            attributes: ['username']
        }]
    })
    .then(dbPost => {
        const post = dbPost.map(post => post.get({
            plain:true
        }));
        res.render('homepage', {
            post,
            loggedIn: req.session.loggedIn
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

// posting the data
router.get('post/:id', (req, res) => {
    Post.findOne({
        where: {
            id: req.params.id
        },
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
    .then(dbPost => {
        if (!dbPost) {
            res.status(404).json({ message: 'id not found'})
            return;
        }
        const post = dbPost.get({ plain: true})
        res.render('singlePost', {
            post, loggedIn: req.session.loggedIn
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    })
})

// taking you to the login page
router.get('/login', (req, res) => {
    if (req.session.loggedIn) {
        res.redirect('/')
        return;
    }
    res.render('login');
});

// taking you to the signup page
router.get('/signup', (req, res) => {
    if (req.session.loggedIn) {
        res.redirect('/')
        return;
    }
    res.render('signup');
});

module.exports = router;