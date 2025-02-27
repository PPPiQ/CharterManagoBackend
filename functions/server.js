
const express = require("express");
const http = require("http");
const path = require('path');
const fs = require("fs");
const fsPromises = require("fs").promises;

const cors = require("cors");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const app = express();
const dotenv = require("dotenv");
const router = express.Router();
// middleware

// Database config 
dotenv.config({ path: "./functions/config/config.env" });
require("./config/Db");

// Cors 
var corsOptions = {
  credentials: true,
  origin: ["http://127.0.0.1:5000", "http://localhost:4200"],
};

app.use(cors(corsOptions));
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("dev")); // logger

// ROUTES
app.use("/", router);

app.use("/api/v1", require("./routes/auth"));
app.use("/api/v1", require("./routes/offers"));
app.use("/api/v1", require("./routes/organizations"));
app.use("", require("./routes/paths"));

// Set the view engine to EJS
app.set('view engine', 'ejs');
// Set the new views directory
app.set('views', path.join(__dirname, 'views'));

PORT = process.env.PORT || 5000;

// Serve static files from the Angular app
app.use(express.static(path.join(__dirname, '../dist/charter-manago/browser/')));

app.listen(PORT, console.log(`SERVER RUNNING ON PORT: ${PORT}.`));
