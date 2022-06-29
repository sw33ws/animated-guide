const router = require('express').Router();
const {User, Post, Comment} = require('../../models');
const Auth = require('../../utils/auth');

// find all Users without the password
router.get('/', (req, res) => {
    User.findAll({
        attributes: {
            exclude: ['password']
        }
    })
    .then(dbUser => res.json(dbUser))
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

// get a single User without the password
router.get('/:id', (req, res) => {
    User.findOne({
        attributes: {
            exclude: ['password']
        },
        where: {
            id: req.params.id
        },
        include: [{
            model: Post,
            attributes: ['id', 'comment_text']
        }, {
            model: Comment,
            attributes: ['id', 'comment_text'],
            include: {
                model: Post,
                attributes: ['title']
            }
        }]
    })
    .then(dbUser => {
        if(!dbUser) {
            res.status(404).json({ message: 'id not found'})
            return;
        }
        res.json(dbUser);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

// creates a new user
router.post('/', Auth, (req, res) => {
    User.create({
        username: req.body.username,
        password: req.body.password
    })
    .then(dbUser => {
        req.session.save(() => {
            req.session.user_id = dbUser.id;
            req.session.username = dbUser.username;
            req.session.loggedIn = true;
            res.json(dbUser);
        })
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

// creating cookie for you to log into
router.post('login', (req, res) => {
    User.findOne({
        where: {
            username: req.body.username
        }
    })
    .then(dbUser => {
        if(!dbUser){
            res.status(400).json({ message: 'No user found with that username'});
            return;
        }
        req.session.save(() => {
            req.session.user_id = dbUser.id;
            req.session.username = dbUser.username;
            req.session.loggedIn = true;
            res.json({
                user: dbUser,
                message: 'Your logged in!'
            });
        });
        const validPassword = dbUser.checkPassword(req.body.password);
        if(!validPassword) {
            req.status(400).json({ message: 'Wrong Password!'});
            return;
        }
        req.session.save(() => {
            req.session.user_id = dbUser.id;
            req.session.username = dbUser.username;
            req.session.loggedIn = true;
            res.json({
                user: dbUser,
                message: 'Your logged in!'
            });
        });
    });
});

// ending the session
router.post('logout', (req, res) => {
    if(req.session.loggedIn) {
        req.session.destroy(() => {
            res.status(204).end();
        })
    } else {
        res.status(404).end();
    }
});

module.exports = router;