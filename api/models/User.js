const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");
const { commonAttributes } = require('./CommonAttributes');
const { USER_POSITIONS, GENDER } = require("../config/constants");

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
    phoneNumber: {
        field: 'phone_number',
        type: DataTypes.INTEGER,
        allowNull: false
    },
    address: {
        type: DataTypes.STRING(500),
        allowNull: false
    },
    joinedAt: {
        field: 'joined_at',
        type: DataTypes.DATE,
        allowNull: false
    },
    position: {
        type: DataTypes.ENUM(USER_POSITIONS.INTERN, USER_POSITIONS.JR_SDE, USER_POSITIONS.MANAGER, USER_POSITIONS.SR_SDE, USER_POSITIONS.TEAM_LEAD),
        allowNull: false
    },
    gender: {
        type: DataTypes.ENUM(GENDER.MALE, GENDER.FEMALE),
        allowNull: false
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

module.exports = { User };