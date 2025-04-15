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

const Country = sequelize.define("Country", {
    id: {
        type: DataTypes.STRING(60),
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING(60),
        allowNull: false,
        unique: true
    },
    cities: {
        type: DataTypes.JSONB
    },
    ...commonAttributes
},
    {
        tableName: "countries",
        timestamps: false
    });

module.exports = { Country };