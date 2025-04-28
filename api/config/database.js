const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    PORT: process.env.DB_PORT,
    dialect: process.env.DB_DIALECT,
    logging: false
});

const connectDB = async () => {
    try {
        await sequelize.authenticate();
    } catch (error) {
        console.error("Unable to connect to the database:", error);
    }
}

connectDB();

module.exports = { sequelize };