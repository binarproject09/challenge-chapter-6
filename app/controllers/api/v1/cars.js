/**
* @file contains request handler of hewan resource
* @author Fikri Rahmat Nurhidayat
*/

// const { cars } = require("../../../models");
const carsService = require("../../../services/cars");
// const users = require("./users");

module.exports = {
    async create(req, res) {
        const { plate, manufacture, model, rentPerDay, capacity, description, availableAt, transmission, available, type, year } = req.body;
        const user = req.user
        carsService.create({
            plate,
            manufacture,
            model,
            rentPerDay,
            capacity,
            description,
            availableAt,
            transmission,
            available,
            type,
            year,
            createdBy: user.username
        })
            .then((createCar) => {
                res.status(201).json({
                    status: "Success",
                    message: `Car was created by ${user.username}`,
                    data: {
                        id: createCar.id,
                        plate: createCar.plate,
                        manufacture: createCar.manufacture,
                        model: createCar.model,
                        rentPerDay: createCar.rentPerDay,
                        capacity: createCar.capacity,
                        description: createCar.description,
                        availableAt: createCar.availableAt,
                        transmission: createCar.transmission,
                        available: createCar.available,
                        type: createCar.type,
                        year: createCar.year,
                        createdBy: user.username
                    }
                });
            })
            .catch((err) => {
                res.status(400).json({
                    status: "FAIL",
                    message: err.message,
                });
            });
    },

    async getAll(req, res) {
        carsService.list()
            .then((dataCar) => {
                res.status(200).json({
                    status: "success",
                    data: {
                        dataCar
                    }
                })
            }).catch((err) => {
                res.status(400).json({
                    status: "FAIL",
                    message: err.message
                })
            })
    },

    async getCar(req, res) {
        const car = await carsService.get(req.params.id)
        if (!car) {
            res.status(404).json({
                status: "FAIL",
                message: `Car not found!`,
            });
            return;
        }

        carsService.get(req.params.id)
            .then(() => {
                res.status(200).json({
                    status: "success",
                    data: car
                })
            }).catch((err) => {
                res.status(400).json({
                    status: "FAIL",
                    message: err.message
                })
            })
    },

    async update(req, res) {
        const { plate, manufacture, model, rentPerDay, capacity, description, availableAt, transmission, available, type, year } = req.body;
        const car = await carsService.get(req.params.id)
        if (!car) {
            res.status(404).json({
                status: "FAIL",
                message: `Car not found!`,
            });
            return;
        }
        carsService.update(req.params.id, {
            plate,
            manufacture,
            model,
            rentPerDay,
            capacity,
            description,
            transmission,
            available,
            type,
            year,
            availableAt,
        }).then(() => {
            res.status(200).json({
                status: "OK",
                message: `Car has been updated `,
            });
        }).catch((err) => {
            res.status(422).json({
                status: "FAIL",
                message: err.message,
            });
        });
    },

    async delete(req, res) {
        const car = await carsService.get(req.params.id)
        if (!car) {
            res.status(404).json({
                status: "FAIL",
                message: `Car not found!`,
            });
            return;
        }

        carsService.update(req.params.id, {
            car
        }).then(() => {
            res.status(200).json({
                status: "OK",
                message: `Car has been deleted.`
            })
        }).catch((err) => {
            res.status(422).json({
                status: "FAIL",
                message: err.message,
            });
        });
    },
    async getAllCreatedCars(req, res) {
        carsService.listOnly({
            where: {
                isDeleted: false
            }
        }, {
            where: {
                isDeleted: false
            }
        }).then((allCars) => {
            res.status(200).json({
                status: "success",
                data: {
                    allCars
                }
            })
        }).catch((err) => {
            res.status(400).json({
                status: "FAIL",
                message: err.message
            })
        })
    },
};
