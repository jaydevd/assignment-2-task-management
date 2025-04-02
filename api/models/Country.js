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

const Country = sequelize.define("countries", {
    id: {
        type: DataTypes.STRING(60),
        primaryKey: true
    },
    country: {
        type: DataTypes.STRING(60),
        allowNull: true,
    }
},
    {
        tableName: "countries",
        timestamps: false
    });

module.exports = { Country };