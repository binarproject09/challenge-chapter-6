const usersRepository = require("../repositories/users");

module.exports = {
    create(requestBody) {
        return usersRepository.create(requestBody);
    },

    update(id, requestBody) {
        return usersRepository.update(id, requestBody);
    },

    delete(id) {
        return usersRepository.delete(id);
    },

    async list() {
        try {
            const users = await usersRepository.findAll();

            return {
                data: users,
            };
        } catch (err) {
            throw err;
        }
    },

    get(id) {
        return usersRepository.findUserById(id);
    },
    getOne(key) {
        return usersRepository.findOne(key);
    },

};
