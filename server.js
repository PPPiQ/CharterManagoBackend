const express = require("express");
const cors = require("cors");
// const cookieSession = require("cookie-session");
const cookieParser = require("cookie-parser");
const app = express();
const dotenv = require("dotenv");
const morgan = require("morgan");


// middleware
dotenv.config({ path: "./config/config.env" });
require("./config/Db");

var corsOptions = {
  credentials: true,
  origin: ["http://localhost:4200", "http://127.0.0.1:5000/", "http://localhost:4200/", "http://localhost:4200/api/v1"],
};

app.use(cors(corsOptions));
app.use(express.json());


// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())
// app.use(
//   cookieSession({
//     name: "sessionToken",
//     keys: [process.env.REFRESH_TOKEN_SECRE, process.env.ACCESS_TOKEN_SECRET],
//     httpOnly: true,
//   })
// );

app.use(morgan("dev")); // logger

// Routes
app.use("/api/v1", require("./routes/auth"));

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to bezkoder application." });
});

PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`SERVER RUNNING ON PORT: ${PORT}.`));
