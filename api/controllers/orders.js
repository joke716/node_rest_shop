
const orderModel = require("../models/order");
const productModel = require("../models/product");

exports.orders_get_all = (req, res, next) => {

    orderModel.find()
        .select("product quantity _id")
        .exec()
        .then(docs => {
            res.json({
                count: docs.length,
                order: docs.map(doc => {
                    return {
                        _id: doc._id,
                        product: doc.product,
                        quantity: doc.quantity,
                        request: {
                            type: "GET",
                            url: "http://localhost:3000/orders/" + doc._id
                        }
                    };
                })
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });

};


exports.orders_create_order = (req, res, next) => {

    productModel.findById(req.body.productId)
        .then(product => {
            if (!product) {
                return res.status(404).json({
                    message: "Product not found"
                });
            }
            const order = new orderModel({
                _id: mongoose.Types.ObjectId(),
                quantity: req.body.quantity,
                product: req.body.productId
            });
            return order.save();
        })
        .then(result => {
            console.log(result);
            res.json({
                message: "Order stored",
                createdOrder: {
                    _id: result._id,
                    product: result.product,
                    quantity: result.quantity
                },
                request: {
                    type: "GET",
                    url: "http://localhost:3000/orders/" + result._id
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};

exports.orders_get_order = (req, res, next) => {

    orderModel.findById(req.params.orderId)
        .exec()
        .then(order => {
            if (!order) {
                return res.status(404).json({
                    message: "Order not found"
                });
            }
            res.json({
                order: order,
                request: {
                    type: "GET",
                    url: "http://localhost:3000/orders"
                }
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        });
};

exports.orders_delete_order = (req, res, next) => {
    orderModel.remove({ _id: req.params.orderId })
        .exec()
        .then(result => {
            res.json({
                message: "oder deleted",
                request: {
                    type: "POST",
                    url: "http://localhost:3000/orders",
                    body: { productId: "ID", quantity: "Number" }
                }
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
};
