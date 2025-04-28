const { sequelize } = require("../../config/database");

module.exports.SaveTask = async (task) => {
    try {
        const query = ``;

        const [result, metadata] = sequelize.query(query);
        return;

    } catch (error) {
        console.log(error);
        throw new Error("Error saving task to socket");
    }
}