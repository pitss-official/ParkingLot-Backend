module.exports = app => {
    const country = require("../controllers/country.controller.js");

    let router = require("express").Router();

    router.post("/", country.create);

    router.get("/", country.findAll);

    router.get("/:id", country.findOne);

    router.put("/:id", country.update);

    router.delete("/:id", country.delete);

    app.use('/api/country', router);
};