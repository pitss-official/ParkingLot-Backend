module.exports = app => {
    const vehicle = require("../controllers/vehicle.controller.js");

    let router = require("express").Router();
    router.get("/:number", vehicle.findCustomerDetailsByNumber);
    router.post('/checkin',vehicle.checkIn);
    app.use('/api/vehicle', router);
};