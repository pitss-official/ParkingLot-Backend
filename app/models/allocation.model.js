module.exports = (sequelize, Sequelize) => {
    return sequelize.define("allocation", {
        startTime: {
            type: 'TIMESTAMP'
        },
        endTime:{
            type:'TIMESTAMP'
        }
    });
};