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

const Category = sequelize.define("Category", {
    id: {
        type: DataTypes.STRING(60),
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING(60),
        allowNull: false,
        unique: true
    },
    subCategories: {
        type: DataTypes.JSONB,
        field: 'sub_categories'
    },
    ...commonAttributes
},
    {
        tableName: "categories",
        timestamps: false
    });

module.exports = { Category };