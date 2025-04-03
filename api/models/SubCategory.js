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
    name: {
        type: DataTypes.STRING(60),
        allowNull: false,
        unique: true,
        field: 'sub_category'
    },
    category: {
        type: DataTypes.STRING(60),
        references: {
            model: 'categories',
            key: 'id'
        }
    }
},
    {
        tableName: "sub_categories", // Explicitly set the table name
        timestamps: false   // If your table does not have createdAt/updatedAt
    });

module.exports = { SubCategory };