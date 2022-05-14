const { user } = require("../models");

module.exports = {
    create(inputArgs) {
        return user.create(inputArgs);
    },

    update(id, updatedArgs) {
        return user.update(updatedArgs, {
            where: {
                id,
            },
        });
    },

    delete(id) {
        return user.destroy({
            where: {
                id
            }
        });
    },

    findUserById(id) {
        return user.findByPk(id);
    },

    findAll() {
        return user.findAll();
    },

    findOne(key) {
        return user.findOne(key);
    },

};
