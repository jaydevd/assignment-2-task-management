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
    userId: {
        field: 'user_id',
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
    comments: {
        type: DataTypes.JSONB
    },
    status: {
        type: DataTypes.ENUM(['to-do', 'in-progress', 'done', 'on-hold', 'in-review', 'cancelled', 'postponed'])
    },
    projectId: {
        field: 'project_id',
        type: DataTypes.STRING(60),
        references: {
            key: 'id',
            model: 'projects'
        }
    },
    ...commonAttributes
},
    {
        tableName: "tasks",
        timestamps: false
    });

module.exports = { Task };