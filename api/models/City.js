/**
 * @name userModel
 * @file User.js
 * @throwsF
 * @description This file will define model of Users table.
 * @author Jaydev Dwivedi (Zignuts)
 */

const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database.js");
const { commonAttributes } = require('./CommonAttributes.js');

const City = sequelize.define("City", {
    id: {
        type: DataTypes.STRING(60),
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING(60),
        allowNull: false,
        unique: true
    },
    country: {
        type: DataTypes.STRING(60),
        references: {
            model: 'countries',
            key: 'id'
        }
    }
},
    {
        tableName: "cities",
        timestamps: false
    });

module.exports = { City };