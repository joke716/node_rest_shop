
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userModel = require("../models/user");

exports.user_get_all = (req, res, next) => {
    userModel
        .find()
        .exec()
        .then(result => {
            res.json(result);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });

};


exports.user_signup = (req, res, next) => {

    const { email, password } = req.body;

    userModel
        .findOne({ email })
        .exec()
        .then(user => {
            if (!user) {
                return res.status(409).json({
                    message: "Mail exists"
                });
            } else {

                bcrypt.hash(password, 10, (err, hash) => {
                    if(err) {
                        return res.status(500).json({
                            error: err
                        });
                    } else {
                        const newUser = new userModel({
                            email, password: hash
                        });

                        newUser
                            .save()
                            .then(result => {
                                console.log(result);
                                res.json({
                                    message: 'User created',
                                    createdUser: result
                                });
                            })
                            .catch(err => {
                                res.status(500).json({
                                    error: err
                                });
                            });
                    }
                });
            }
        })

};


exports.user_login = (req, res, next) => {

    const { email, password } = req.body

    userModel
        .findOne({ email })
        .exec()
        .then(user => {
            if (!user) {
                return res.status(401).json({
                    message: "Auth failed"
                });
            }
            bcrypt.compare(password, user.password, (err, result) => {

                if (err) {
                    return res.status(401).json({
                        message: "Auth failed"
                    });
                }

                if (result) {
                    const token = jwt.sign({
                            userId: user._id,
                            email: user.email
                        },
                        process.env.SECRET,
                        { expiresIn: "1h" }
                    );
                    return res.status(200).json({
                        message: "Auth successful",
                        token: token
                    });
                }
                res.status(401).json({
                    message: "Auth failed"
                });
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });

};


exports.user_delete = (req, res) => {
    userModel
        .findByIdAndDelete({ _id: req.params.userId })
        .exec()
        .then(result => {
            res.json({
                message: "User deleted"
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};

