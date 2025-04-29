const { Admin } = require("../models/index");
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');
const { sequelize } = require("./database");
const { ADMIN } = require('./constants');

module.exports.bootstrap = async () => {
    try {
        const query = `
        SELECT id from admins limit 1;
        `
        const [admins, metadata] = await sequelize.query(query);

        if (Object.keys(admins).length != 0) return;

        const id = uuidv4();
        const name = ADMIN.NAME;
        const email = ADMIN.EMAIL;
        const password = process.env.ADMIN_PASSWORD;
        const hashedPassword = await bcrypt.hash(password, 10);
        const createdAt = Math.floor(Date.now() / 1000);

        const INSERT = `
        INSERT INTO admins
            (id, name, email, password, created_at, created_by, is_active, is_deleted)
        VALUES
            ('${id}', '${name}', '${email}', '${hashedPassword}', '${createdAt}', '${id}', true, false)
        `;
        await sequelize.query(INSERT);

    } catch (error) {
        throw new Error(error);
    }
};