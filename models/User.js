'use strict';
const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    class User extends Sequelize.Model {}
    User.init({
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        firstName: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        lastName: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        emailAddress: {
            type: Sequelize.STRING,
            validate: {
                isEmail: {
                    args: true,
                    msg: "Please provide a unique, properly-formatted email address"
                }
            }
        },
        password: {
            type: Sequelize.STRING,
            allowNull: false
        }
    }, { sequelize });

    User.associate = (models) => {
        User.hasMany(models.Course, {
            foreignKey: {
                fieldName: "userId"
            }
        })
    };

    return User;
};
