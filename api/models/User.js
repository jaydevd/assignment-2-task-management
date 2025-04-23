/**
 * @name userModel
 * @file User.js
 * @throwsF
 * @description This file will define model of Users table.
 * @author Jaydev Dwivedi (Zignuts)
 */

const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");
const { commonAttributes } = require('./CommonAttributes');

const User = sequelize.define("User", {
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
    token: {
        type: DataTypes.STRING(200),
        allowNull: true,
        unique: true,
    },
    password: {
        type: DataTypes.STRING(60),
        allowNull: false,
        unique: false
    },
    ...commonAttributes
},
    {
        tableName: "users",
        timestamps: false
    }
);
User.sync({ force: true }).then(() => {
    console.log("User table synced successfully.");
}).catch((err) => {
    console.error("Error syncing User table:", err);
});

module.exports = { User };