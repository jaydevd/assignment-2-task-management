/**
 * @name commonAttributes
 * @file CommonAttributes.js
 * @throwsF
 * @description This file contains all common attributes used across the tables.
 * @author Jaydev Dwivedi (Zignuts)
 */

const { DataTypes } = require("sequelize");

const commonAttributes = {
    createdAt: {
        type: DataTypes.DATE,
        field: 'created_at'
    },
    createdBy: {
        type: DataTypes.STRING(60),
        field: 'created_by'
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        field: 'is_active'
    },
    isDeleted: {
        type: DataTypes.BOOLEAN,
        field: 'is_deleted'
    },
    updatedAt: {
        type: DataTypes.DATE,
        field: 'updated_at',
        allowNull: true
    },
    updatedBy: {
        type: DataTypes.STRING(60),
        allowNull: true,
        field: 'updated_by'
    }
}

module.exports = {
    commonAttributes
}