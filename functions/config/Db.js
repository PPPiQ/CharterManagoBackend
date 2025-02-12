const mongoose = require("mongoose");
const db = require("../models");
const Role = db.role;


console.log(`PATCH: ${process.env.MONGO_URI} `)

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("DATABASE CONNECTED");
    initial();
  })
  .catch((err) => {
    console.error("DATABASE CONNECTION ERROR ", err);
    process.exit();
  });

async function initial() {
  const countAdmin = await Role.countDocuments({ name: "admin" }).then(
    (count) => {
      if (count === 0) {
        console.log("added admin role.");
        Role.create({ name: "admin" });
      }
    }
  );
  const countUser = await Role.countDocuments({ name: "user" }).then(
    (count) => {
      if (count === 0) {
        console.log("added user role.");
        Role.create({ name: "user" })
      }
    }
  );
  const countModerator = await Role.countDocuments({ name: "moderator" }).then(
    (count) => {
      if (count === 0) {
        console.log("added moderator role.");
        Role.create({ name: "moderator" })
      }
    }
  );
}
