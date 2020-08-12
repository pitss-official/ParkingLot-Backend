module.exports = (sequelize, Sequelize) => {
    return sequelize.define("bill", {
        amount: {
            type: Sequelize.STRING
        },
        startTime: {
            type: 'TIMESTAMP'
        },
        endTime:{
            type:'TIMESTAMP'
        }
    });
};