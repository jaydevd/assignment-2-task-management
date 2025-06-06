const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");
const { commonAttributes } = require('./CommonAttributes');

const Project = sequelize.define("Project", {
    id: {
        type: DataTypes.STRING(60),
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING(60),
        unique: true
    },
    ...commonAttributes
},
    {
        tableName: "projects",
        timestamps: false
    });

module.exports = { Project };