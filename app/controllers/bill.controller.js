const db = require('../models')
const Bill = db.bills;
const Op = db.sequelize.Op;
const { QueryTypes } = require('sequelize');
exports.findOne = (req, res) => {
    const id = req.params.id;
    Bill.findByPk(id)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving Bills with id=" + id
            });
        });
};
exports.findAll = (req,res)=>{
    db.sequelize.query(`SELECT bills.id, startTime,endTime,amount, vehicles.number as vehicleNumber from bills LEFT JOIN vehicles ON bills.vehicleId= vehicles.id`,{type:QueryTypes.SELECT}).then(data=>{
        res.send(data);
    })
}
exports.earnings = (req,res)=>{
    db.sequelize.query(`(SELECT sum(amount) as totalAmount from bills) UNION (SELECT sum(BILLS.amount) as amountToday from bills WHERE createdAt >= CURDATE())`,{type:QueryTypes.SELECT}).then(data=>{
        res.send(data);
    })
}
exports.update = (req, res) => {
    const id = req.params.id;
    Bill.update(req.body, {
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Bill was updated successfully."
                });
            } else {
                res.send({
                    message: `Cannot update Bill with id=${id}. Maybe Bill was not found or req.body is empty!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating Bill with id=" + id
            });
        });
};