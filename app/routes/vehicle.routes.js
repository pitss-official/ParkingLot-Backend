module.exports = app => {
    const vehicle = require("../controllers/vehicle.controller.js");

    let router = require("express").Router();
    router.get("/:number/isParked/",vehicle.isCheckIn);
    router.get("/:number", vehicle.findCustomerDetailsByNumber);
    router.post('/checkin',vehicle.checkIn);
    router.post('/empcheckIn',vehicle.empCheckIn);
    router.post('/empcheckOut',vehicle.empcheckOut);
    app.use('/api/vehicle', router);
};