module.exports = app => {
    const spot = require("../controllers/spot.controller.js");

    let router = require("express").Router();

    router.post("/", spot.create);

    router.get("/", spot.findAll);
    router.get("/byLotId/:id",spot.findAllByLotId);
    router.get("/:id", spot.findOne);

    router.put("/:id", spot.update);

    router.delete("/:id", spot.delete);

    app.use('/api/spot', router);
};