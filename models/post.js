const { stubFalse } = require("lodash");
const { Model, DataTypes } = require("sequelize")
const sequelize = require('../config/connections');

class Post extends Model {}

Post.init({
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        references: {
            model: 'user',
            key: 'id'
        }
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    post_text: {
        type: DataTypes.STRING,
        allowNull: true
    },
},  {
        sequelize,
        freezeTableName: true,
        underscored: true,
        modelName: 'post'
    }
);

module.exports = Post;