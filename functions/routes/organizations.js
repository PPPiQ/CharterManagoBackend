const router = require("express").Router();
const Organization = require("../models/Organization");
const verifyAuth = require("../middleware/verifyAuth");
const User = require("../models/User");
const Role = require("../models/Role");
const UserRoles = require("../models/UserRoles");

function denyJSON() {
  return {
    success: false,
  };
}

// POST | add organization
router.post("/add-organization", verifyAuth, async (req, res) => {
  try {
    const newOrganization = await Organization.create({
      name: req.body.name,
      created_by: req.body.user,
    });

    if (newOrganization?.created_at && newOrganization.name === req.body.name) {
      const userRef = await User.findOne({ _id: req.user.id });
      const adminRef = await Role.findOne({ name: "admin" });


      // Update UserRoles
      // Check if user has already role admin assigned to the user
      const existingRole = await UserRoles.findOne({
        user_id: userRef.id,
        role_id: adminRef.id,
      });

      if (!existingRole) {
        // Create owner admin role for the user
        const result = await UserRoles.create({
          user_id: userRef,
          role_id: adminRef,
        });
      }


      res.status(200).json({
        data: newOrganization,
        success: true,
      });
    } else {
      res.status(400).json({
        msg: "error on organization craetion.",
        success: false,
      });
    }
  } catch (error) {
    res.status(400).json({
      msg: "error on organization craetion.",
      success: false,
    });
  }
});

// GET | /api/v1/organizations | Public | get list of organizations
router.get("/organizations", async (req, res) => {
  try {
    const organizations = await Organization.find();
    res.status(200).json({ data: organizations, success: true });
  } catch (error) {
    console.error("Error geting organizations");
    console.error(error);
    res.stats(400).json({
      msg: error.message,
      success: false,
    });
  }
});

// DELETE | /api/v1/delete/:id | Private | deletes organization selected by id
router.delete("/delete/:id", verifyAuth, async (req, res) => {
  try {
    if (req.params && req.params.id) {
      const org = await Organization.findById(req.params.id);
      if (org) {
        const deletionResult = await Organization.collection.deleteOne(org);
        if (
          deletionResult?.acknowledged &&
          deletionResult?.deletedCount === 1
        ) {
          return res.status(200).json({ success: true });
        }
      }
    }
    return res.status(400).json(denyJSON());
  } catch (e) {
    console.log(err);
    return res.status(400).json(denyJSON());
  }
  // try {

  //   const org = await Organization.findById(req.params.id);

  //   if (!org) {
  //     res.status(400).json(denyJSON());
  //   }

  //   if (!org.id == req.params.id) {
  //     res.status(400).json(denyJSON());
  //   } else {
  //     const deletionResult = await org.deleteOne();
  //     if (deletionResult.acknowledged) {
  //       res.status(200).json({ success: true });
  //     } else {
  //       res.status(400).json(denyJSON());
  //     }
  //   }
  // } catch (error) {
  //   console.log(err);
  //   res.status(400).json(denyJSON());
  // }
});

module.exports = router;
