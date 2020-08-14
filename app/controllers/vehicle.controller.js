const db = require('../models')
const Vehicle = db.vehicles;
const Op = db.sequelize.Op;
const { QueryTypes } = require('sequelize');

const calculateBillAmount = (vehicleType,hours) =>{
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
    let amount = 0;
    if(vehicleType===0){
        if(hours<1){
            amount = 30;
        }else if(hours<2){
            amount = 50;
        }else{
            amount = 100;
        }
    }if(vehicleType===1){
        if(hours<1){
            amount = 40;
        }else if(hours<2){
            amount = 60;
        }else{
            amount = 150;
        }
    }
    return amount;
}
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
    }).then(data=>{
        t.commit();
        res.send({id:req.body.spotID})
    })
}catch (e) {
        console.log(e);
        res.status(500).send({message:e});
        await t.rollback();
    }
}
exports.empCheckIn=async (req,res)=>{
    //check if the target spot is empty
    spotID = req.body.spotID;
    const status = await db.sequelize.query(`select isBlocked from spots where spots.id=${spotID}`,{type:QueryTypes.SELECT});
    if(status[0].isBlocked===1){
        res.status(500).send({message:"Cannot park to a filled spot"});
        return;
    }
    const t = await db.sequelize.transaction();
    var spotObj;
    try {
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
    vacant = true;
    let vehicleID = vehicle?vehicle[0].id:vehicleDetails.id;
    console.log(vehicleID);
    await db.allocations.create({startTime:db.sequelize.literal('CURRENT_TIMESTAMP'),vehicleId:vehicleID,
        spotId:req.body.spotID},{ transaction: t });
    await db.spots.update({isBlocked:1},{
        where: { id: req.body.spotID },
        transaction:t
    }).then(data=>{
        t.commit();
        res.send({id:req.body.spotID})
    })
    }catch (e) {
        console.log(e);
        res.status(500).send({message:e});
        await t.rollback();
    }
}



exports.isCheckIn=async (req,res)=>{
    const number = req.params.number;
    const data = await db.sequelize.query(`SELECT spots.id as id from allocations left join vehicles on vehicles.id=allocations.vehicleId left join spots on spots.id = allocations.spotId where vehicles.number = ${number} `,{type:QueryTypes.SELECT});
    if(data.length>0){
        res.send({status:data[0].id});
    }else {
        res.send({status:0});
    }
}
exports.empcheckOut = async (req,res)=>{
    //we will get the spot id
    const id = req.body.spotID;
    let spot = await db.sequelize.query(`SELECT isBlocked from spots where spots.id =${id}`,{type:QueryTypes.SELECT});
    if(spot[0].isBlocked===0){

        res.status(500).send({message:"cannot checkout an empty spot"});
        return ;
    }
    const t = await db.sequelize.transaction();
    try{
        await db.sequelize.query(`SELECT *, allocations.id as allocationId ,(UNIX_TIMESTAMP(NOW()) - UNIX_TIMESTAMP(allocations.startTime))/3600 as hours from spots left join allocations on spots.id=allocations.spotId where spots.id = ${id}`,{type:QueryTypes.SELECT}).then(async data=>{
            data =data[0];
            //delete the allocation from the table
            await db.allocations.destroy({where: { id: data.allocationId}},{transaction:t})
            //free the spot
            await db.sequelize.query(`UPDATE spots set isBlocked = '0' where id = ${data.spotId}`,{type:QueryTypes.UPDATE,transaction:t})
            //calculate the billing amount for the customer
            let amount = calculateBillAmount(data.type,data.hours);
            //create a bill for the vehicle and store
            await db.bills.create({
                startTime:data.startTime,
                endTime:db.sequelize.literal('CURRENT_TIMESTAMP'),
                amount,
                vehicleId:data.vehicleId
            },{transaction:t});
            t.commit();
            res.send({amount,hours:data.hours});
        })}
    catch (e) {
        console.log(e);
        res.status(500).send({message:e});
        await t.rollback();
    }
}