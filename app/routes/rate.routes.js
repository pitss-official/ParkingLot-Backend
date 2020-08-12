module.exports = app => {
    const rate = require("../controllers/rate.controller.js");

    let router = require("express").Router();

    router.post("/", rate.create);

    router.get("/", rate.findAll);

    router.get("/:id", rate.findOne);

    router.put("/:id", rate.update);

    router.delete("/:id", rate.delete);

    app.use('/api/rate', router);
};