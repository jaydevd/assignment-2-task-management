const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");
const { commonAttributes } = require('./CommonAttributes');
const { STATUS } = require("../config/constants");

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
    title: {
        type: DataTypes.STRING(128),
        allowNull: false,
    },
    dueDate: {
        field: 'due_date',
        type: DataTypes.INTEGER,
    },
    status: {
        type: DataTypes.ENUM(STATUS.TO_DO, STATUS.CANCELLED, STATUS.POSTPONED, STATUS.PENDING, STATUS.DONE, STATUS.IN_PROGRESS, STATUS.IN_REVIEW, STATUS.ON_HOLD)
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