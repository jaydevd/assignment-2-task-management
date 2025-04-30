const { sequelize } = require("../../config/database");

module.exports.getTasks = async () => {
    try {
        const date = Math.floor(Date.now() / 1000);
        const query = `
        SELECT t.id, t.title, t.status, u.id as user_id, u.name, p.name as project
        FROM tasks
        JOIN users u
        ON tasks.user_id = u.id
        WHERE
        t.is_active = true AND
        due_date >= '${date}'
        `;

        const [tasks, metadata] = sequelize.query(query);

        return tasks;

    } catch (error) {
        console.log('Error fetching data:', error);
    }
};