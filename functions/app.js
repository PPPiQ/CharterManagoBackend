const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const app = express();
const dotenv = require("dotenv");
const router = express.Router();
// middleware

dotenv.config({ path: "./functions/config/config.env" });
require("./config/Db");

var corsOptions = {
  credentials: true,
  origin: ["http://localhost:4200", "http://127.0.0.1:5000/", "http://localhost:4200/", "http://localhost:4200/api/v1"],
};

app.use(cors(corsOptions));
app.use(express.json());
app.use("/.backend/functions/app", router);

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())
app.use(morgan("dev")); // logger

// Routes
app.use("/api/v1", require("./routes/auth"));

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to bezkoder application." });
});

PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`SERVER RUNNING ON PORT: ${PORT}.`));
