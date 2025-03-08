const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const verifyAuth = require("../middleware/verifyAuth");
const UserRoles = require("../models/UserRoles");
const Role = require("../models/Role");
const Group = require("../models/Group");

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
    let { firstName, lastName, email, password } = req.body;

    if (!email || !firstName || !lastName || !password) {
      res.status(400).json(denyJSON("please fill the required fields"));
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    password = hashedPassword;

    const result = await User.create({ firstName, lastName, email, password });

    if (!result) {
      return res.status(400).json(denyJSON("Ann error accurend on registration."));
    }

    createdUser = await User.findOne({ email });
    console.log("Created user: ");
    console.log(createdUser);

    jwt.sign(
      { id: result._id },
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
      console.log("User not exists. Login refusal.");

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

// POST | /api/v1/add-group | private | add authorization group
router.post("/add-group", verifyAuth, async (req, res) => {
  try {
    const { groupName } = req.body;

    if (!groupName) {
      res.status(400).json(denyJSON("please fill the required fields"));
    }

    const newOrganization = await Group.create({
      group_name: groupName,
    });

    console.log("Group creation result is: ", newOrganization.group_name);

    if (
      newOrganization?.created_at &&
      newOrganization.group_name === groupName
    ) {
      res.status(200).json({
        success: true,
        data: { groupName },
      });
    } else {
      res.status(400).json(denyJSON());
    }
  } catch (error) {
    console.log(error);
    res.status(400).json(denyJSON());
  }
});

// POST | /api/v1/logout | public | logout user
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
          const accessToken = jwt.sign({}, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: "10m",
          });
          return res.json({ accessToken });
        }
      }
    );
  } else {
    return res.status(406).json({ message: "Unauthorized" });
  }
});

// GET | /apo/v1/user-roles | public | get all posts
router.get("/user-roles", verifyAuth, async (req, res) => {
  try {
    const userRoles = await UserRoles.find({ user_id: req.user.id });
    const rolesList = [];
    if (userRoles) {
      for (const role of userRoles) {
        const currentRole = await Role.findOne({
          _id: role.role_id,
        });
        if (currentRole) rolesList.push(currentRole.name);
      }
    }
    console.log(rolesList);
    return res.status(200).json({
      data: rolesList,
      success: true,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json(denyJSON());
  }
});

module.exports = router;
