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

        if (admins.length() != 0) return;

        const id = uuidv4();
        const name = ADMIN.NAME;
        const email = ADMIN.EMAIL;
        const password = process.env.ADMIN_PASSWORD;
        const hashedPassword = await bcrypt.hash(password, 10);
        const createdAt = Math.floor(Date.now() / 1000);

        await Admin.create({
            id,
            name,
            email,
            password: hashedPassword,
            createdAt,
            createdBy: id,
            isActive: true,
            isDeleted: false
        });

    } catch (error) {
        throw new Error(error);
    }
};