const router = require('express').Router();

const postRoutes = require('./post');
const commentRoutes = require('./comment');
const userRoutes = require('./user')

router.use('/post', postRoutes);
router.use('/comment', commentRoutes);
router.use('/user', userRoutes)

module.exports = router;