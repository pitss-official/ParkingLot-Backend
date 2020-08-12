const dbConfig = require("../config/db.config.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,
    operatorsAliases: false,
    pool: {
        max: dbConfig.pool.max,
        min: dbConfig.pool.min,
        acquire: dbConfig.pool.acquire,
        idle: dbConfig.pool.idle
    }
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.customers = require("./customer.model")(sequelize,Sequelize);
db.vehicles = require("./vehicle.model")(sequelize,Sequelize);
db.customers.hasMany(db.vehicles, { as: "vehicles" });
db.vehicles.belongsTo(db.customers, {
    foreignKey: "customerId",
    as: "customer",
});
db.countries = require('./country.model')(sequelize,Sequelize);
db.cities = require('./city.model')(sequelize,Sequelize);
db.lots = require('./lot.model')(sequelize,Sequelize);
db.spots = require('./spot.model')(sequelize,Sequelize);
db.bills = require('./bill.model')(sequelize,Sequelize);
db.allocations = require('./allocation.model')(sequelize,Sequelize);
db.countries.hasMany(db.cities,{as:"cities"});
db.cities.belongsTo(db.countries,{
    foreignKey:'countryId',
    as:'country'
})
db.cities.hasMany(db.lots,{as:"lots"});
db.lots.belongsTo(db.cities,{
    foreignKey:'cityId',
    as:'city'
})
db.lots.hasMany(db.spots,{as:"spots"});
db.spots.belongsTo(db.lots,{
    foreignKey:'lotId',
    as:'lot'
})
db.customers.hasMany(db.bills,{as:"bills"});
db.bills.belongsTo(db.customers,{
    foreignKey:'customerId',
    as:'customer'
})
db.allocations.hasOne(db.vehicles)
db.allocations.hasOne(db.spots)

module.exports = db;