const router = require("express").Router();
const Organization = require("../models/Organization");
const verifyAuth = require("../middleware/verifyAuth");

// POST | add organization
router.post("/add-organization", verifyAuth, async (req, res) => {
  try {
    console.log("Trying to create organization");
    
    const newOrganization = await Organization.create({
      name: req.body.name,
    });
    return res.status(200).json({
      data: newOrganization,
      success: true,
    });
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


module.exports = router;