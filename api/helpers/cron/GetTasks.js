const { sequelize } = require("../../config/database");

module.exports.GetTasks = async () => {
    try {
        const query = `
        
        `;
        const [tasks, metadata] = sequelize.query(query);

        return tasks;

    } catch (error) {
        console.log('Error fetching data:', error);
        return { projects: [], users: [], tasks: [] };
    }
};