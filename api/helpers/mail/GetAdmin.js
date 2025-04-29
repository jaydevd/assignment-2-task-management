const { Admin } = require('./../../models');

module.exports.getAdmin = async () => {
    try {
        const admin = Admin.findOne({ attributes: ['id', 'name', 'email'] });
        return admin;
    } catch (error) {
        console.log(error);
    }
}