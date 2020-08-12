module.exports = (sequelize, Sequelize) => {
    return sequelize.define("lot", {
        name: {
            type: Sequelize.STRING
        },
    });
};