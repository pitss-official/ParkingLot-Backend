const db = require('../models')
const Lot = db.lots;
const Op = db.sequelize.Op;
//todo validation
exports.create = (req, res) => {
    if (!req.body.name) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
        return;
    }
    const lot = {
        name: req.body.name
    };
    Lot.create(lot)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the lot."
            });
        });
};
//find by lot name
exports.findAll = (req, res) => {
    const name = req.query.name;
    let condition = name ? { name: { [Op.like]: `%${name}%` } } : null;
    Lot.findAll({ where: condition })
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
    Lot.findByPk(id)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving Lots with id=" + id
            });
        });
};
exports.findAllByLotId = (req,res)=>{
    const id = req.params.id;
    Lot.findAll({ where: {cityId:id} })
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

    Lot.update(req.body, {
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Lot was updated successfully."
                });
            } else {
                res.send({
                    message: `Cannot update Lot with id=${id}. Maybe Lot was not found or req.body is empty!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating Lot with id=" + id
            });
        });
};

exports.delete = (req, res) => {
    const id = req.params.id;

    Lot.destroy({
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Lot was deleted successfully!"
                });
            } else {
                res.send({
                    message: `Cannot delete Lot with id=${id}. Maybe Lot was not found!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete Lot with id=" + id
            });
        });
};