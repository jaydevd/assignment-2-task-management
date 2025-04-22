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

const Task = sequelize.define("Task", {
    id: {
        type: DataTypes.STRING(60),
        primaryKey: true
    },
    user: {
        type: DataTypes.STRING(60),
        references: {
            key: 'id',
            model: 'users'
        }
    },
    description: {
        type: DataTypes.STRING(60),
        allowNull: false,
    },
    dueDate: {
        field: 'due_date',
        type: DataTypes.DATE,
    },
    status: {
        type: DataTypes.ENUM(['pending', 'in-progress', 'completed'])
    },
    ...commonAttributes
},
    {
        tableName: "tasks",
        timestamps: false
    });

module.exports = { Task };