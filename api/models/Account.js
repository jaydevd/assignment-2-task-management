/**
 * @name AccountModel
 * @file User.js
 * @throwsF
 * @description This file will define model of accounts table.
 * @author Jaydev Dwivedi (Zignuts)
 */

const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database.js");
const { commonAttributes } = require('./CommonAttributes.js');

const Account = sequelize.define("Account", {
    id: {
        type: DataTypes.STRING(60),
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING(60),
        allowNull: false,
    },
    category: {
        type: DataTypes.STRING(60),
        allowNull: false,
        references: {
            model: 'categories',
            key: 'id'
        }
    },
    subCategory: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'sub_category',
        references: {
            model: 'categories',
            key: 'id'
        }
    },
    ...commonAttributes
},
    {
        tableName: "accounts", // Explicitly set the table name
        timestamps: false   // If your table does not have createdAt/updatedAt
    });

module.exports = { Account };