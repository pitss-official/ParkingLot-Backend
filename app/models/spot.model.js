module.exports = (sequelize, Sequelize) => {
    return sequelize.define("spot", {
        name: {
            type: Sequelize.STRING
        },
        shortName: {
            type: Sequelize.STRING,
            defaultValue:Sequelize.NULL
        },
        type:{
            type:Sequelize.INTEGER,
            defaultValue:0
        },
        isBlocked:{
            type:Sequelize.INTEGER,
            defaultValue:0
        },
        level:{
            type:Sequelize.INTEGER,
            defaultValue:1
        }
    });
};