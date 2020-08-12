module.exports = (sequelize, Sequelize) => {
    return sequelize.define("customer", {
        name: {
            type: Sequelize.STRING
        },
        email: {
            type: Sequelize.STRING
        },
    });
};