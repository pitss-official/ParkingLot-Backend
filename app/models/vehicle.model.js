module.exports = (sequelize, Sequelize) => {
    return sequelize.define("vehicle", {
        number: {
            type: Sequelize.STRING
        },
        type: {
            type: Sequelize.INTEGER
        }
    });
};