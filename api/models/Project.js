/**
 * @name AdminModel
 * @file Admin.js
 * @throwsF
 * @description This file will define model of Admins table.
 * @author Jaydev Dwivedi (Zignuts)
 */

const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");
const { commonAttributes } = require('./CommonAttributes');

const Project = sequelize.define("Project", {
    id: {
        type: DataTypes.STRING(60),
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING(60),
        unique: true
    },
    members: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        references: {
            key: 'id',
            model: 'users'
        }
    },
    ...commonAttributes
},
    {
        tableName: "projects",
        timestamps: false
    });

module.exports = { Project };