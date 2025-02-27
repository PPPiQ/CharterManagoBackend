const router = require("express").Router();
const Offer = require("../models/Offer");
const verifyAuth = require("../middleware/verifyAuth");

function denyJSON(message) {
    return {
      msg: message,
      success: false,
    };
  }

// POST | /api/v1/add-offer | Private | adds offer when authrised
router.post("/add-offer", verifyAuth, async (req, res) => {
  try {
    const newOffer = await Offer.create({
      title: req.body.title,
      description: req.body.description,
      state: req.body.state,
      imageUrl: req.body.imageUrl,
      createdBy: req.body.createdBy
    });

    res.status(200).json({
      data: newOffer,
      success: true,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json(denyJSON());
  }
});

// DELETE | /api/v1/remove-offer/:id | Private | removes offer when authrised
router.delete("/delete-offer/:id", verifyAuth, async (req, res) => {
  try {
    const offer = await Offer.findById(req.params.id);
    if (!offer) {
      return res.status(400).json(denyJSON());
    }

    if (!offer.OfferId == req.offer.id) {
      return res.status(400).json(denyJSON());
    } else {
      await offer.deleteOne();
    }

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (err) {
    console.log(err);
    res.status(400).json(denyJSON());
  }
});

// GET | /api/v1/offers | Public | get list of all available offers
router.get('/offers', async (req, res) => {
    try {

        const offers = await Offer.find();
        res.status(200).json({
          data: offers,
          success: true,
        });
    } catch (error) {
        console.error("Offer get failed");
        console.error(error);
        res.status(500).json(process.env.FAILURE_OBJEC);
    }
});

module.exports = router;