module.exports = app => {
    const lot = require("../controllers/lot.controller.js");

    let router = require("express").Router();

    router.post("/", lot.create);

    router.get("/", lot.findAll);

    router.get('/byCityId/:id',lot.findAllByLotId);

    router.get("/:id", lot.findOne);

    router.put("/:id", lot.update);

    router.delete("/:id", lot.delete);

    app.use('/api/lot', router);
};