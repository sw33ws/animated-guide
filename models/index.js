const User = require('./User');
const Post = require('./Post');
const Comment = require('./Comment');

User.hasManny(Post, {
    foreignKey: 'user_id'
});

User.hasManny(Comment, {
    foreignKey: 'user_id'
});

Post.hasMany(Comment, {
    foreignKey: 'post_id'
});

Post.belongsTo(User, {
    foreignKey: 'user_id'
});

Comment.belongsTo(User, {
    foreignKey: 'user_id'
});

Comment.belongsTo(Post, {
    foreignKey: 'post_id'
});

module.exports = {User, Post, Comment};