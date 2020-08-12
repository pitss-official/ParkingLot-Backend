module.exports = (sequelize, Sequelize) => {
    return sequelize.define("spot", {
        startTime: {
            type: 'TIMESTAMP'
        },
        endTime:{
            type:'TIMESTAMP'
        },
    });
};