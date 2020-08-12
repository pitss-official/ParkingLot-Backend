module.exports = (sequelize, Sequelize) => {
    return sequelize.define("country", {
        name: {
            type: Sequelize.STRING
        },
        shortName: {
            type: Sequelize.STRING
        }
    });
};