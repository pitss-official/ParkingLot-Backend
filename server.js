const express = require("express");
const cors = require("cors");

const app = express();
require('dotenv').config();

app.use(cors());

app.use(express.json());

const db = require("./app/models");
if(process.env.ENV=='dev'){
    db.sequelize.sync({ force: true }).then(() => {
        console.log("Drop and re-sync db.");
    });
}else db.sequelize.sync();

app.get("/",(req,res)=>{
    res.json({"message":"Welcome"})
})


const port = process.env.PORT || 8000;

app.listen(port,()=>console.log(`Server running at port ${port}`));