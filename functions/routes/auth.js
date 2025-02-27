const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const verifyAuth = require("../middleware/verifyAuth");

const INVALID_CREDENTIALS_STR = "invalid credentials";

function denyJSON(message) {
  return {
    msg: message,
    success: false,
  };
}

function raportFailure(res, err) {
  console.log(err);
  res.status(400).json({ success: false });
}

// POST | /api/v1/register | public | register user
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!email || !name || !password) {
      res.status(400).json(denyJSON("please fill the required fields"));
    }

    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json(denyJSON("user already exists"));
    }

    user = new User({ name, email, password });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    await user.save();

    jwt.sign(
      { id: user._id },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: 36000 },
      (err, token) => {
        if (err) throw err;
        res.status(200).json({ token });
      }
    );
  } catch (err) {
    raportFailure(res, err);
  }
});

// POST api/v1/login | public | login exixting user
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      console.log("missing fields");
      res.status(400).json(denyJSON("Invalid user"));
    }

    let user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(400).json(denyJSON("Invalid user"));
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
      });
    }

    //creating a access token
    const accessToken = jwt.sign(
      { id: user._id },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "10m" }
    );

    // creating refresh token
    const refreshToken = jwt.sign(
      { id: user._id },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "1h" }
    );

    res.cookie("sessionToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({ accessToken });
  } catch (err) {
    console.log(err);
    res.status(406).json({ success: false, msg: "Invalid credentials" });
  }
});

// GET api/vi/user | private | get logged in user for the process of auth
router.get("/user", verifyAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json({
      user,
      success: true,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: "SERVER ERROR" });
  }
});

router.post("/refresh", (req, res) => {
  // let rawToken = req.headers?.cookie;
  // const token = rawToken && rawToken.split('=')[1];
  const refreshToken = req?.cookies?.sessionToken;
  if (refreshToken) {


    // Verifying refresh token
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      (err, decoded) => {
        if (err) {
          // Wrong Refesh Token
          return res.status(406).json({ message: "Unauthorized" });
        } else {
          // Correct token we send a new access token
          const accessToken = jwt.sign(
            {},
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "10m" }
          );
          return res.json({ accessToken });
        }
      }
    );
  } else {
    return res.status(406).json({ message: "Unauthorized" });
  }
});

router.post("/logout", async (req, res) => {
  const refreshToken = req.cookies?.sessionToken;
  if (refreshToken) {
    try {
      // Verifying refresh token
      jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, decoded) => {
          if (err) {
            // Wrong Refesh Token
            return res.status(406).json({
              message: "Unauthorized",
              token: "Verification incorect",
            });
          } else {
            // Correct token we send a new access token
            res.cookie("sessionToken", null);
            const accessToken = null;
            return res.json({ accessToken });
          }
        }
      );
    } catch (err) {
      res.status(406).json({ message: "Error on logout" });
    }
  } else {
    return res.status(406).json({ message: "No cookies" });
  }
});

module.exports = router;
