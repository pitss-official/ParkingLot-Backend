module.exports = (sequelize, Sequelize) => {
    return sequelize.define("rate", {
        vehicleType: {
            type: Sequelize.INTEGER
        },
        rate: {
            type: Sequelize.DECIMAL
        },
        startTime:{
            type: Sequelize.DECIMAL
        },
        endTime:{
            type:Sequelize.DECIMAL
        }
    });
};