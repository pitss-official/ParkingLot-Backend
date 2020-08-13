const db = require('../models')
const Vehicle = db.vehicles;
const Op = db.sequelize.Op;
const { QueryTypes } = require('sequelize');

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

        await db.customers.create({name:req.body.customerName,email:""},{ transaction: t }).then(newCustomer=>customer=newCustomer);
        await Vehicle.create({number,customerId:customer.id,type:req.body.vehicleType},{ transaction: t }).then(newvehicle=>vehicleDetails=newvehicle);
    }
    //if not exist create a customer and vehicle id
    //check if spot is empty
    vacant = true;
    let vehicleID = vehicle?vehicle[0].id:vehicleDetails.id;
    //if not empty return invalid response
        console.log(vehicleID);
    await db.allocations.create({startTime:db.sequelize.literal('CURRENT_TIMESTAMP'),vehicleId:vehicleID,
        spotId:req.body.spotID},{ transaction: t });
    await db.spots.update({isBlocked:1},{
        where: { id: req.body.spotID },
        transaction:t
    })
        let customerID = vehicle?vehicle[0].customer.id:customer.id;
    await db.bills.create({customerId:customerID,startTime:db.sequelize.literal('CURRENT_TIMESTAMP')},{transaction:t}).then(data=>{
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
exports.empCheckIn=async (req,res)=>{
    const t = await db.sequelize.transaction();
    var spotObj;
    try {
        await db.spots.findByPk(req.body.spotID).then(spot=>{
            spotObj = spot;
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

        await db.customers.create({name:req.body.customerName,email:""},{ transaction: t }).then(newCustomer=>customer=newCustomer);
        await Vehicle.create({number,customerId:customer.id,type:spotObj.dataValues.type},{ transaction: t }).then(newvehicle=>vehicleDetails=newvehicle);
    }
    //if not exist create a customer and vehicle id
    //check if spot is empty
    vacant = true;
    let vehicleID = vehicle?vehicle[0].id:vehicleDetails.id;
    //if not empty return invalid response
    console.log(vehicleID);
    await db.allocations.create({startTime:db.sequelize.literal('CURRENT_TIMESTAMP'),vehicleId:vehicleID,
        spotId:req.body.spotID},{ transaction: t });
    await db.spots.update({isBlocked:1},{
        where: { id: req.body.spotID },
        transaction:t
    })
    let customerID = vehicle?vehicle[0].customer.id:customer.id;
    await db.bills.create({customerId:customerID,startTime:db.sequelize.literal('CURRENT_TIMESTAMP')},{transaction:t}).then(data=>{
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



exports.isCheckIn=async (req,res)=>{
    const number = req.params.number;
    Vehicle.findAll({ where: {number},include:[{model:db.customers,as:"customer"}] })
        .then(data => {
            if(data.length===0){
                res.send({status:0});
            }else{
                res.send({status:1});
            }
        })
        .catch(err => {
            console.log(err)
            res.status(500).send({
                message: "Error retrieving vehicles with id=" + number
            });
        });
}
exports.empcheckOut = async (req,res)=>{
    const t = await db.sequelize.transaction();
    try{
        let spotID = req.body.spotID;
        // let allocation;
        // await db.allocations.findAll({where:{spotId:spotID}}).then(data=> {
        //     allocation = data[0]
        // });
        const allocation = await db.sequelize.query(`SELECT * from allocations where spotId=${req.body.spotID}`, { type: QueryTypes.SELECT });
        let vehicle;
        // res.send(allocation)
        const timediff = await db.sequelize.query(`SELECT UNIX_TIMESTAMP(NOW()) - UNIX_TIMESTAMP(startTime) as result from allocations where id=${allocation[0].id}`, { type: QueryTypes.SELECT });
        let hours = timediff[0].result/3600;
        /*
        ------------------------------------
| Vehicle Type| Time In hours| Fee |
------------------------------------
| Four Wheeler|           <1 |  40 |
------------------------------------
| Four Wheeler|           <2 |  60 |
------------------------------------
| Four Wheeler|           >2 | 150 |
------------------------------------
| Two Wheeler |           <1 |  30 |
------------------------------------
| Two Wheeler |           <2 |  50 |
------------------------------------
| Two Wheeler |           >2 | 100 |
------------------------------------
         */
        var amount =0;
        await db.vehicles.findByPk(allocation[0].vehicleId).then(data=>vehicle=data)
        if(vehicle.type===0){
            if(hours<1){
                amount = 30;
            }else if(hours<2){
                amount = 50;
            }else{
                amount = 100;
            }
        }if(vehicle.type===1){
            if(hours<1){
                amount = 40;
            }else if(hours<2){
                amount = 60;
            }else{
                amount = 150;
            }
        }
        await db.allocations.destroy({where: { id: allocation[0].id }})
        await db.sequelize.query(`update spots set isBlocked='0' where id=${req.body.spotID}`, { type: QueryTypes.UPDATE });
        t.commit();
        res.send({amount,hours})
    }catch (e) {
        console.log(e);
        res.status(500).send({message:e});
        await t.rollback();
    }
}
exports.checkOut = async (req,res)=>{
    const number = req.params.number;
    const t = await db.sequelize.transaction();
    try{
        //fetch the vehicle and customer details
        let vehicle;
        await Vehicle.findAll({ where: {number},include:[{model:db.customers,as:"customer"}] }).then(data=>{
            vehicle = data[0];
        })
        await db.allocations.findAll({where:{vehicleId:vehicle.id}})
        //find the bill with non finshed time
        //update the bill and allocation time
        //unpin the slot from slot id
    }catch (e) {
        console.log(e);
        res.status(500).send({message:e});
        await t.rollback();
    }
}