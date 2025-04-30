const { sequelize } = require("../../config/database");

module.exports.getTasks = async () => {
    try {
        const date = Math.floor(Date.now() / 1000);
        let selectClause = `SELECT t.id, t.title, t.status, u.id as user_id, u.name, p.name as project`;
        const fromClause = `\n FROM tasks
        JOIN users u
        ON tasks.user_id = u.id`;
        let whereClause = `WHERE
        t.is_active = true AND
        due_date >= '${date}'`;

        selectClause = selectClause
            .concat(fromClause)
            .concat(whereClause);

        const [tasks, metadata] = sequelize.query(selectClause);

        return tasks;

    } catch (error) {
        console.log('Error fetching data:', error);
    }
};