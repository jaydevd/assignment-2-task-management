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
    },
    token: {
        type: DataTypes.STRING(200),
    },
    ...commonAttributes
},
    {
        tableName: "admins",
        timestamps: false
    }
);

module.exports = { Admin };