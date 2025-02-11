const router = require("express").Router();
// Models
const Post = require("../models/Post");
const User = require("../models/User");
// MIDDLEWARE
const verifyAuth = require("../middleware/verifyAuth");

function denyJSON() {
  return {
    success: false,
  };
}

// GET | /apo/v1/posts | public | get all posts
router.get("/posts", async (req, res) => {
  try {
    const posts = await Post.find();
    return res.status(200).json({
      data: posts,
      success: true,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json(denyJSON());
  }
});

// GET | /apo/v1/followers-posts | private | get all posts from the users that logged in users follow
router.get("/followers-posts", verifyAuth, async (req, res) => {
  try {
    const get_user = await User.findById(req.user.id);
    const posts = await Post.find({ UserId: get_user.followers }).populate(
      "posted_by"
    );
    res.status(200).json({
      data: posts,
      success: true,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json(denyJSON());
  }
});

// GET | /api/v1/post/:id | public | get a simple post by id
router.get("/post/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      res.status(400).json({
        success: false,
        msg: "No post",
      });
    }

    res.status(200).json({
      data: post,
      success: true,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      success: false,
    });
  }
});

// POST | /api/v1/add-new | private | add a new post
router.post("/add-new", verifyAuth, async (req, res) => {
  try {
    const newPost = await Post.create({
      UserId: req.user.id,
      title: req.body.title,
      description: req.body.description,
      post_image: req.body.image_url,
    });

    res.status(200).json({
      data: newPost,
      success: true,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json(denyJSON());
  }
});

// PUT | /app/v1/post/edit-post/:id | Private | Edit a post
router.put("/edit-post/:id", verifyAuth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(400).json({
        success: false,
        msg: "no post",
      });
    }

    if (!post.UserId == req.params.id) {
      return res.status(400).json({ success: false });
    } else {
      await post.updateOne({
        UserId: req.user.id,
        title: req.body.title,
        description: req.body.description,
        post_image: req.body.image_url,
      });
    }

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      success: false,
      msg: "error",
    });
  }
});

// DELETE | /api/v1/post/delete-post/:id | Private | delete a ost
router.delete("/delete-post/:id", verifyAuth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(400).json(denyJSON());
    }

    if (!post.UserId == req.user.id) {
      return res.status(400).json(denyJSON());
    } else {
      await post.deleteOne();
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

module.exports = router;
