const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  console.log("Access token");
  console.log(token);
  // let rawToken = req.headers?.cookie;
  // const token = rawToken && rawToken.split('=')[1];
  console.log('Cookies');
  console.log(req.cookies?.sessionToken);
  // const token = req.cookies?.sessionToken;
  const denyJSON = {
    msg: "No token provided!",
    success: false,
  };
  if (!token) {
    return res.status(401).json(denyJSON);
  }
  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(400).json(denyJSON);
  }
};
