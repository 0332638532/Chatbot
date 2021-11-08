import express  from "express";
import bodyParser from "body-parser";
import viewEngine from "./configs/viewEngine";
import initwebRoutes from "./routes/web";
require('dotenv').config();


let app= express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended:true}));

//config view engine
viewEngine(app);

//config web routes
initwebRoutes(app);


let port= process.env.PORT || 6969;

app.listen(port, () =>{
    console.log("App is running at the port: " +port);
});