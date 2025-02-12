const router = require("express").Router();
const Post = require("../models/Post");
const User = require("../models/User");
const verifyAuth = require("../middleware/verifyAuth");

// GET | /api/v1/post/like/:id | Private | Like a post
router.get("/like/:id", verifyAuth, async (req, res) => {
  try {
    const liked = await Post.updateOne(
      {
        _id: req.params.id,
      },
      {
        $push: {
          likes: req.user.id,
        },
      }
    );
    if (!liked) {
      return res.status(401).json({ success: false });
    }

    res.status(200).json({ success: true });
  } catch (err) {
    console.log(err);
    res.status(400).json({ success: false });
  }
});

// GET | /api/v1/post/unlike/:id | Private | unlike a post
router.get("/unlike/:id", verifyAuth, async (req, res) => {
  try {
    const liked = await Post.updateOne(
      { _id: req.params.id },
      { $pull: { likes: req.user.id } }
    );

    if (!liked) {
      return res.status(401).json({ success: false });
    }
    res.status(200).json({ success: true });
  } catch (err) {
    console.log(err);
    res.status(400).json({ success: false });
  }
});

// GET | /api/v1/post/pollow/:id | Private | folow a User
router.get("/follow/:id", verifyAuth, async (req, res) => {
  try {
    const followed = await User.updateOne(
      { _id: req.user.id },
      { $push: { following: req.params.id } }
    );

    const followersAdded = await user.updateOne(
      { _id: req.params.id },
      { $push: { followed: req.user.id } }
    );

    if (!followed || !followersAdded) {
      return res.status(401).json({ success: false });
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.log(error);
    res.status(400).json({ success: false });
  }
});

// GET | /api/v1/post/unfollow/:id | Private | unfollow a User
router.get("/unfollow/:id", verifyAuth, async (req, res) => {
  try {
    const followFixed = await User.updateOne(
      { _id: req.user.id },
      { $pull: { following: req.params.id } }
    );

    if (!followFixed || !followersFixed) {
      return res.status(401).json({ success: false });
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.log(error);
    res.status(400).json({ success: false });
  }
});

// GET | /api/v1/post/profile/:id | public | get a users profile by ID
router.get("/profile/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate("posts");

    if (!user) {
      return res.status(401).json({ success: false });
    }

    res.status(200).json({ data: user, success: true });
  } catch (error) {
    console.log(error);
    res.status(400).json({ success: false });
  }
});

module.exports = router;
