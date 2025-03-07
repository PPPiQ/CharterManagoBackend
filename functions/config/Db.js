const mongoose = require("mongoose");
const db = require("../models");
const Role = db.role;
const Permission = db.permission;

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
        Role.create({ name: "user" });
      }
    }
  );
  const countModerator = await Role.countDocuments({ name: "moderator" }).then(
    (count) => {
      if (count === 0) {
        console.log("added moderator role.");
        Role.create({ name: "moderator" });
      }
    }
  );

  const permissions = await Permission.countDocuments().then((count) => {
    if (count === 0) {
      console.log("Adding permission initial values.");
      Permission.create(
        {
          binary: 1111,
          code: "crud",
          description: "Create,Retrieve,Update, Delete",
        },
        { binary: 1110, code: "cru", description: "Create Retreve Update" },
        { binary: 1101, code: "crd", description: "Create Retreve Delete" },
        { binary: 1100, code: "cr", description: "Create Retreve" },
        { binary: 1011, code: "cud", description: "Create Update Delete" },
        { binary: 1010, code: "cu", description: "Create Update" },
        { binary: 1001, code: "cd", description: "Create Delete" },
        { binary: 1000, code: "c", description: "Create" },
        { binary: 111, code: "rud", description: "Retrieve Update Delete" },
        { binary: 110, code: "ru", description: "Retrieve Update" },
        { binary: 101, code: "rd", description: "Retrieve Delete" },
        { binary: 100, code: "r", description: "Retrieve" },
        { binary: 11, code: "ud", description: "Update Delete" },
        { binary: 10, code: "u", description: "Update" },
        { binary: 1, code: "d", description: "Delete" },
        { binary: 0, code: "none", description: "No rights" }
      );
    }
  });
}
