const router = require('express').Router();
const sequelize = require('../config/connection');
const { Post, User, Comment } = require('../models');
const auth = require('../utils/auth');

// setting up the dashboard
router.get('/', auth, (req, res) => {
    Post.findAll({
        where: {
            user_id: req.session.user_id
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
    .then(dbpost => {
        const post = dbpost.map(post => post.get({ plain: true}));
        res.render('dashboard', {
           post,
           loggedIn: true
        });
    })
    .catch(err => {
       console.log(err);
       res.status(500).json(err);
    });
});

// posting the data
router.get('/edit/:id', auth, (req, res) => {
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
    .then(dbpost => {
        if (!dbpost) {
            res.status(404).json({ message: 'id not found'})
            return;
        }
        const post = dbpost.get({ plain: true});
        res.render('editPost', {
            post,
            loggedIn: true
        })
    })
});

module.exports = router;