const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');
const bcrypt = require("bcrypt");

class User extends Model {
    checkPassword(loginPw) {
        return bcrypt.compareSync(loginPw, this.password);
    }
}

User.init({
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    username: {
        type: DataTypes.STRING,
        unique:true,
        allowNull: false,
        validate:{
        isAlphanumeric:true
        }
    },

    password:{
        type:DataTypes.STRING,
        allowNull: false,
        validate:{
            len:[8]
        }
    }
},{
    hooks:{
        beforeCreate: async (newUser) => {
        newUser.password = await bcrypt.hashSync(newUser.password,10);
        return newUser;
        },
        beforeUpdate:async (updatedUser) =>{
        updatedUser.password = await bcrypt.hashSync(updatedUser.password,10);
        return updatedUser;
        }
    },
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'User',
});

module.exports = User;