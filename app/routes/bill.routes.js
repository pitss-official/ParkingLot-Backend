module.exports = app => {
    const bill = require("../controllers/bill.controller.js");

    let router = require("express").Router();
    router.get("/:id", bill.findOne);

    router.put("/:id", bill.update);

    app.use('/api/bill', router);
};