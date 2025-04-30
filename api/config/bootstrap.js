const { Admin } = require("../models/index");
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');

module.exports.bootstrap = async () => {
    try {
        const admin = await Admin.findOne({ attributes: ['id'] });

        if (admin) return;

        const id = uuidv4();
        const name = "Admin user";
        const email = "admin2025@gmail.com";
        const password = process.env.ADMIN_PASSWORD;
        const hashedPassword = await bcrypt.hash(password, 10);
        const createdAt = Math.floor(Date.now() / 1000);

        await Admin.create({
            id,
            name,
            email,
            password: hashedPassword,
            createdAt
        });

    } catch (error) {
        throw new Error(error);
    }
};