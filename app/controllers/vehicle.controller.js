const db = require('../models')
const Vehicle = db.vehicles;
const Op = db.sequelize.Op;

exports.findCustomerDetailsByNumber=(req,res)=>{
    const number = req.params.number;
    Vehicle.findAll({ where: {number},include:[{model:db.customers,as:"customer"}] })
        .then(data => {
            res.send(data);
        })
            .catch(err => {
                console.log(err)
                res.status(500).send({
                    message: "Error retrieving vehicles with id=" + number
                });
            });
}
exports.checkIn = async (req,res)=>{
    if (!req.body.lot) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
        return;
    }
    const t = await db.sequelize.transaction();

    try {
        await db.spots.findByPk(req.body.spotID).then(spot=>{
            if(spot.dataValues.isBlocked ===1){
                res.status(400).send({message:"spot is blocked, try another spot"});
                return;
            }
        });
    let number = req.body.vehicleNumber;
    let vehicle=false;
    //check if vehicle id exist
    await Vehicle.findAll({where:{number},include:[{model:db.customers,as:"customer"}]}).then(data=>{
        if(data.length===0){
            vehicle = false;
        }else {
            vehicle = data;
        }
    });
    let customer;
    let vehicleDetails = undefined;
    if (vehicle==false){

        await db.customers.create({name:req.body.name,email:""},{ transaction: t }).then(newCustomer=>customer=newCustomer);
        await Vehicle.create({number,customerId:customer.id},{ transaction: t }).then(newvehicle=>vehicleDetails=newvehicle);
    }
    //if not exist create a customer and vehicle id
    //check if spot is empty
    vacant = true;

    //if not empty return invalid response
    await db.allocations.create({startTime:db.sequelize.literal('CURRENT_TIMESTAMP'),vehicleId:vehicle[0].id||vehicleDetails.id,
        spotId:req.body.spotID},{ transaction: t });
    await db.spots.update({isBlocked:1},{
        where: { id: req.body.spotID },
        transaction:t
    })
    await db.bills.create({customerId:vehicle[0].customer.id||customer.id,startTime:db.sequelize.literal('CURRENT_TIMESTAMP')},{transaction:t}).then(data=>{
        t.commit();
        res.send(data)
    })
    //if vacant, put engaged tag, insert into allocations and bills, return bill id;
    // console.log(req.body);
    // res.send(req.body);
}catch (e) {
        console.log(e);
        res.status(500).send({message:e});
        await t.rollback();
    }
}