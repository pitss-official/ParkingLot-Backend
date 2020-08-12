module.exports = (sequelize, Sequelize) => {
    return sequelize.define("vehicle", {
        number: {
            type: Sequelize.STRING,
            unique:true
        },
        type: {
            type: Sequelize.INTEGER
        }
    });
};