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

const SubCategory = sequelize.define("SubCategory", {
    id: {
        type: DataTypes.STRING(60),
        primaryKey: true
    },
    subCategory: {
        type: DataTypes.STRING(60),
        allowNull: false,
        field: 'sub_category'
    }
},
    {
        tableName: "categories", // Explicitly set the table name
        timestamps: false   // If your table does not have createdAt/updatedAt
    });

module.exports = { SubCategory };