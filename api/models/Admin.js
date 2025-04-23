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
    token: {
        type: DataTypes.STRING(200),
        allowNull: true,
        unique: true,
    },
    ...commonAttributes
},
    {
        tableName: "admins",
        timestamps: false
    }
);

Admin.sync({ force: true }).then(() => {
    console.log("User table synced successfully.");
}).catch((err) => {
    console.error("Error syncing User table:", err);
});

module.exports = { Admin };