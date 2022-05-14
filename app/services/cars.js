const carsRepository = require("../repositories/cars");

module.exports = {
    create(requestBody) {
        return carsRepository.create(requestBody);
    },

    update(id, requestBody) {
        return carsRepository.update(id, requestBody);
    },

    delete(id, requestBody) {
        return carsRepository.delete(id, requestBody);
    },

    async list() {
        try {
            const cars = await carsRepository.findAll();

            return {
                data: cars,
            };
        } catch (err) {
            throw err;
        }
    },

    async listOnly(params) {
        try {
            const cars = await carsRepository.findAllOnlyWith(params);

            return {
                data: cars,
            };
        } catch (err) {
            throw err;
        }
    },

    get(id) {
        return carsRepository.findCarById(id);
    },

    getOne(key) {
        return carsRepository.findOne(key);
    }
};
