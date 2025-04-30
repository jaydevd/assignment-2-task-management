const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");
const { commonAttributes } = require('./CommonAttributes');

const Comment = sequelize.define("Comment", {
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
    taskId: {
        field: 'task_id',
        type: DataTypes.STRING(60),
        references: {
            key: 'id',
            model: 'tasks'
        }
    },
    comment: {
        type: DataTypes.STRING(200),
        allowNull: false
    },
    ...commonAttributes
},
    {
        tableName: "comments",
        timestamps: false
    });

module.exports = { Comment };