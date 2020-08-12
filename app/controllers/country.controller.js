const db = require('../models')
const Country = db.countries;
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
    const country = {
        name: req.body.name,
        shortName: req.body.shortName
    };
    Country.create(country)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the country."
            });
        });
};
//find by country name
exports.findAll = (req, res) => {
    const name = req.query.name;
    let condition = name ? { name: { [Op.like]: `%${name}%` } } : null;
    Country.findAll({ where: condition })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving countries."
            });
        });
};

exports.findOne = (req, res) => {
    const id = req.params.id;
    Country.findByPk(id)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving Countries with id=" + id
            });
        });
};

exports.update = (req, res) => {
    const id = req.params.id;

    Country.update(req.body, {
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Country was updated successfully."
                });
            } else {
                res.send({
                    message: `Cannot update Country with id=${id}. Maybe Country was not found or req.body is empty!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating Country with id=" + id
            });
        });
};

exports.delete = (req, res) => {
    const id = req.params.id;

    Country.destroy({
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Country was deleted successfully!"
                });
            } else {
                res.send({
                    message: `Cannot delete Country with id=${id}. Maybe Country was not found!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete Country with id=" + id
            });
        });
};
