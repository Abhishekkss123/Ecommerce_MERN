const app = require("./app");

const dotenv = require("dotenv");

const connectDatabase = require("./config/database");

process.on("uncaughtException",(err)=>{
    console.log(`Error :${err.message}`);
    console.log(`shutting down due to uncaught Exception error`);
    process.exit(1);
});


dotenv.config({path: "beckend/config/config.env"});


connectDatabase();



app.listen(process.env.PORT,()=>{

    console.log('server is working on http://localhost:${process.env.PORT}')
});

process.on("unhandledRejection",(err)=>{
    console.log(`Error : ${err.message}`);
    console.log(`shuuting down the server due to unhandeled promise rejection`);

    Server.close(()=>{
        process.exit(1);
    });
});