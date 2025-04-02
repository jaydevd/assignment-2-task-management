/**
 * @name AdminModel
 * @file Admin.js
 * @throwsF
 * @description This file will define model of Admins table.
 * @author Jaydev Dwivedi (Zignuts)
 */

const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database.js");
const { commonAttributes } = require('./CommonAttributes.js');

const Admin = sequelize.define("Admin", {
    id: {
        type: DataTypes.STRING(60),
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING(60),
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING(60),
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING(60),
        allowNull: false,
        unique: false
    },
    gender: {
        type: DataTypes.STRING(10),
        allowNull: false,
        unique: false
    },
    token: {
        type: DataTypes.STRING(500),
        allowNull: true,
        unique: true,
    },
    ...commonAttributes
},
    {
        tableName: "admins", // Explicitly set the table name
        timestamps: false   // If your table does not have createdAt/updatedAt
    });

module.exports = { Admin };