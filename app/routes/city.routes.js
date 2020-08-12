module.exports = app => {
    const city = require("../controllers/city.controller.js");

    let router = require("express").Router();

    router.post("/", city.create);

    router.get("/", city.findAll);

    router.get('/byCountryId/:id',city.findAllByCountryID);

    router.get("/:id", city.findOne);

    router.put("/:id", city.update);

    router.delete("/:id", city.delete);

    app.use('/api/city', router);

};