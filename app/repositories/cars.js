const { car } = require("../models");

module.exports = {
    create(createArgs) {
        return car.create(createArgs);
    },

    update(id, updateArgs) {
        return car.update(updateArgs, {
            where: {
                id,
            },
        });
    },

    delete(id) {
        return car.update({
            where: {
                id
            }
        });
    },

    findCarById(id) {
        return car.findByPk(id);
    },

    findAll() {
        return car.findAll();
    },

    findOne(key) {
        return car.findOne(key);
    },

    findAllOnlyWith(params) {
        return car.findAll(params);
    },

};
