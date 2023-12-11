const express = require("express");

const app = express();

const cookieParser = require("cookie-parser");

const errorMiddelware = require("../beckend/middelware/error");

app.use(express.json());
app.use(cookieParser());

const product = require("./routes/productroute");
const user = require("./routes/userRoutes");

app.use("/api/v1", product);
app.use("/api/v1", user);

app.use(errorMiddelware);

module.exports = app;
