/**
 * @file contains request handler of hewan resource
 * @author Fikri Rahmat Nurhidayat
 */

const usersService = require("../../../services/users")
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

module.exports = {
    async register(req, res) {
        const { username, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        usersService.create({
            username,
            email: email.toLowerCase(),
            password: hashedPassword,
        })
            .then((create) => {
                res.status(201).json({
                    status: "Success",
                    message: "Registration success!",
                    data: {
                        id: create.id,
                        username,
                        email: create.email
                    }
                });
            }).catch((err) => {
                res.status(400).json({
                    status: "FAIL",
                    message: err.message,
                });
            });
    },

    async getUser(req, res) {
        const user = await usersService.get(req.params.id)
        if (!user) {
            res.status(404).json({
                status: "FAIL",
                message: `User not found!`,
            });
            return;
        }

        usersService.get(req.params.id)
            .then(() => {
                res.status(200).json({
                    status: "success",
                    data: user
                })
            }).catch((err) => {
                res.status(400).json({
                    status: "FAIL",
                    message: err.message
                })
            })
    },

    async getAll(req, res) {
        usersService.list()
            .then((allUsers) => {
                res.status(200).json({
                    status: "success",
                    data: {
                        allUsers
                    }
                })
            }).catch((err) => {
                res.status(400).json({
                    status: "FAIL",
                    message: err.message
                })
            })
    },

    async update(req, res) {
        const { username, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await usersService.get(req.params.id)
        if (!user) {
            res.status(404).json({
                status: "FAIL",
                message: `User not found!`,
            });
            return;
        }

        if (username.length <= 10) {
            res.status(400).json({
                status: 'failed',
                message: 'username must have 10 or less characters!'
            })
            return;
        }

        if (password.length <= 10) {
            res.status(400).json({
                status: 'failed',
                message: 'Password must have 10 or less characters!'
            })
            return;
        }

        const name = await usersService.findOne({
            where: {
                username
            }
        })

        if (name) {
            res.status(404).json({
                status: "FAIL",
                message: "username already taken!",
            });
            return;
        }

        usersService.update(req.params.id, {
            username,
            password: hashedPassword,
        }).then(() => {
            res.status(200).json({
                status: "OK",
                message: `User with id ${req.params.id} has been updated.`,
            });
        }).catch((err) => {
            res.status(422).json({
                status: "FAIL",
                message: err.message,
            });
        });
    },

    async delete(req, res) {

        const user = await usersService.get(req.params.id)
        if (!user) {
            res.status(404).json({
                status: "FAIL",
                message: `User not found!`,
            });
            return;
        }

        usersService.delete(req.params.id)
            .then(() => {
                res.status(200).json({
                    status: "OK",
                    message: `User has been deleted.`
                })
            }).catch((err) => {
                res.status(422).json({
                    status: "FAIL",
                    message: err.message,
                });
            });
    },
    async login(req, res) {
        const user = req.user;

        const token = jwt.sign({
            id: user.id,
            username: user.username,
            email: user.email,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        }, process.env.JWT_PRIVATE_KEY || 'rahasiaNegara', {
            expiresIn: '100h'
        });

        res.status(201).json({
            id: user.id,
            email: user.email,
            username: user.username,
            token,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        });
    },

    async checkCondition(req, res, next) {
        const { username, email, password } = req.body;
        if (password.length <= 10) {
            res.status(400).json({
                status: 'failed',
                message: 'Password must have 10 or less characters!'
            })
            return;
        }

        if (username.length <= 10) {
            res.status(400).json({
                status: 'failed',
                message: 'Username must have 10 or less characters!'
            })
            return;
        }

        const filter = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/g

        if (email == '' || email.search(filter) == -1) {
            res.status(400).json({
                status: 'failed',
                message: 'Wrong email format!'
            })
            return;
        }

        const checkEmail = await usersService.getOne({
            where: { email }
        });
        const checkUsername = await usersService.getOne({
            where: { username }
        });

        if (checkEmail) {
            res.status(400).json({
                status: 'failed',
                message: 'Email already taken!'
            })
            return;
        }

        if (checkUsername) {
            res.status(400).json({
                status: 'failed',
                message: 'username already taken!'
            })
            return;
        }

        next();
    },

    async checkData(req, res, next) {
        const username = req.body.username;
        const email = req.body.email.toLowerCase();
        const password = req.body.password;

        const user = await usersService.getOne({
            where: { email }
        })

        const name = await usersService.getOne({
            where: { username }
        })

        if (!user) {
            res.status(404).json({
                status: "FAIL",
                message: `Email not found!`,
            });
            return;
        }

        if (!name) {
            res.status(404).json({
                status: "FAIL",
                message: `username not found!`,
            });
            return;
        }

        const comparePassword = await bcrypt.compareSync(password, user.password)

        if (!comparePassword) {
            res.status(401).json({
                message: 'Wrong Password. Please Try Again!'
            });
            return;
        }
        req.user = user;
        next();
    },

    async whoAmI(req, res) {
        res.status(200).json(req.user);
    },

    async intoAdmin(req, res) {

        //for superadmin

        const user = await usersService.get(req.params.id)
        if (!user) {
            res.status(404).json({
                status: "FAIL",
                message: `User with id ${req.params.id} not found!`,
            });
            return;
        }

        const admin = req.body.isAdmin;

        usersService.update(req.params.id, {
            isAdmin: admin
        }).then(() => {
            var addString = '';
            if (admin == true) {
                addString = 'now';
            } else {
                addString += "no longer"
            };

            res.status(200).json({
                status: "OK",
                message: `User with id ${req.params.id} is ${addString} an admin.`,
            });
        }).catch((err) => {
            res.status(422).json({
                status: "FAIL",
                message: err.message,
            });
        });

    }
}

