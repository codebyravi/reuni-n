const express = require('express');
const cors = require('cors');
const http = require('http');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
var helmet = require('helmet');
const authRouter = require("./auth-route");
const router = require("./router");



const app = express();
app.use(helmet());
app.use(cors());
app.use(bodyParser.json());
const port = process.env.PORT || 8082;
const mongoUrl = process.env.MONGO || "localhost";
const MONGO_PORT = process.env.MONGO_PORT || "";
const MONGO_PREFIX = process.env.MONGO_PREFIX || "mongodb://";
const MONGO_USER = process.env.MONGO_USER || "reunionuserusuario";
const MONGO_PASSWORD = process.env.MONGO_PASSWORD || "123asd123z";
const MONGO_DATABASE = process.env.MONGO_DATABASE || "reunion";
const MONGO_PARAMS = process.env.MONGO_PARAMS || "";
const authValue = MONGO_USER+":"+MONGO_PASSWORD+"@"

function connect () {
    return mongoose.connect(MONGO_PREFIX+authValue+mongoUrl+MONGO_PORT+'/'+MONGO_DATABASE+MONGO_PARAMS,{
    //return mongoose.connect('mongodb://localhost:27017/reunion',{
        useNewUrlParser: true, 
        authSource:"admin" ,
        keepAlive: 1 
        });
}
function reconnect (){
    setTimeout(
        function() {
            connect();
        },10000);
}

connect();

mongoose.connection.on('error', console.error)
    .on('disconnected', reconnect)
    .once('open', listen);

function listen(){
    app.use(authRouter);
    app.use(router);
    http.createServer(app).listen(port);
    console.log("Listening port: "+port);
}