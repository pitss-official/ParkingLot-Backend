const db = require('../models')
const Spot = db.spots;
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
    const spot = {
        name: req.body.name,
        shortName: req.body.shortName,
        type:req.body.type
    };
    Spot.create(spot)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the spot."
            });
        });
};
//find by spot name
exports.findAll = (req, res) => {
    const name = req.query.name;
    let condition = name ? { name: { [Op.like]: `%${name}%` } } : null;
    Spot.findAll({ where: condition })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving spots."
            });
        });
};
exports.findAllByLotId = (req,res)=>{
    const id = req.params.id;
    Spot.findAll({
        where: {lotId:id},
        order:[['level','ASC'],['type','DESC']],
    })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving spots."
            });
        });
}
exports.findOne = (req, res) => {
    const id = req.params.id;
    Spot.findByPk(id)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving Spots with id=" + id
            });
        });
};

exports.update = (req, res) => {
    const id = req.params.id;

    Spot.update(req.body, {
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Spot was updated successfully."
                });
            } else {
                res.send({
                    message: `Cannot update Spot with id=${id}. Maybe Spot was not found or req.body is empty!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating Spot with id=" + id
            });
        });
};

exports.delete = (req, res) => {
    const id = req.params.id;

    Spot.destroy({
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Spot was deleted successfully!"
                });
            } else {
                res.send({
                    message: `Cannot delete Spot with id=${id}. Maybe Spot was not found!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete Spot with id=" + id
            });
        });
};