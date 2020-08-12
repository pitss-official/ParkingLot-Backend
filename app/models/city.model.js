module.exports = (sequelize, Sequelize) => {
    return sequelize.define("city", {
        name: {
            type: Sequelize.STRING
        },
        shortName: {
            type: Sequelize.STRING
        }
    });
};