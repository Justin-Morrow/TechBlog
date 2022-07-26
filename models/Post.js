const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class Post extends Model {}

Post.init({
    name: DataTypes.STRING, 
    description: DataTypes.STRING
},{
    sequelize,
});

module.exports = Post;
