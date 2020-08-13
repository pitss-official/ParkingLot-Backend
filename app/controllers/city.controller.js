const db = require('../models')
const City = db.cities;
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
    const city = {
        name: req.body.name,
        countryId: req.body.countryId,
        shortName: req.body.shortName
    };
    City.create(city)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the city."
            });
        });
};
//find by city name
exports.findAll = (req, res) => {
    const name = req.query.name;
    let condition = name ? { name: { [Op.like]: `%${name}%` } } : null;
    City.findAll({ where: condition })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving cities."
            });
        });
};

exports.findOne = (req, res) => {
    const id = req.params.id;
    City.findByPk(id)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving Cities with id=" + id
            });
        });
};
exports.findAllByCountryID = (req,res)=>{
    const id = req.params.id;
    City.findAll({ where: {countryId:id} })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving cities."
            });
        });
}
exports.update = (req, res) => {
    const id = req.params.id;

    City.update(req.body, {
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "City was updated successfully."
                });
            } else {
                res.send({
                    message: `Cannot update City with id=${id}. Maybe City was not found or req.body is empty!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating City with id=" + id
            });
        });
};

exports.delete = (req, res) => {
    const id = req.params.id;

    City.destroy({
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "City was deleted successfully!"
                });
            } else {
                res.send({
                    message: `Cannot delete City with id=${id}. Maybe City was not found!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete City with id=" + id
            });
        });
};