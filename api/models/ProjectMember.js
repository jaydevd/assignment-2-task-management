const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");
const { commonAttributes } = require('./CommonAttributes');
const { PROJECT_ROLES } = require("../config/constants");

const ProjectMember = sequelize.define("ProjectMember", {
    id: {
        type: DataTypes.STRING(60),
        primaryKey: true,
        references: {
            key: 'id',
            model: 'users'
        }
    },
    projectId: {
        field: "project_id",
        type: DataTypes.STRING(60),
        references: {
            key: 'id',
            model: 'projects'
        }
    },
    role: {
        type: DataTypes.ENUM(PROJECT_ROLES.TEAM_LEAD, PROJECT_ROLES.MANAGER, PROJECT_ROLES.DEVELOPER, PROJECT_ROLES.TESTER),
        allowNull: false
    },
    ...commonAttributes
},
    {
        tableName: "project_members",
        timestamps: false
    });

module.exports = { ProjectMember };