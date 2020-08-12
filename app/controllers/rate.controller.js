const db = require('../models')
const Rate = db.rates;
const Op = db.sequelize.Op;
//todo validation
exports.create = (req, res) => {
// Validate request
    if (!req.body.name) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
        return;
    }
    const rate = {
        name: req.body.name,
        email: req.body.email
    };
    Rate.create(rate)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the Rate."
            });
        });
};
//find by rate name
exports.findAll = (req, res) => {
    const name = req.query.name;
    let condition = name ? { name: { [Op.like]: `%${name}%` } } : null;
    Rate.findAll({ where: condition })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving rates."
            });
        });
};

exports.findOne = (req, res) => {
    const id = req.params.id;
    Rate.findByPk(id)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving Rate with id=" + id
            });
        });
};

exports.update = (req, res) => {
    const id = req.params.id;

    Rate.update(req.body, {
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Rate was updated successfully."
                });
            } else {
                res.send({
                    message: `Cannot update Rate with id=${id}. Maybe Rate was not found or req.body is empty!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating Rate with id=" + id
            });
        });
};

exports.delete = (req, res) => {
    const id = req.params.id;

    Rate.destroy({
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Rate was deleted successfully!"
                });
            } else {
                res.send({
                    message: `Cannot delete Rate with id=${id}. Maybe Rate was not found!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete Rate with id=" + id
            });
        });
};