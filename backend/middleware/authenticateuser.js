const jwt = require("jsonwebtoken");
const authenticateUser = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Access Denied. No token provided." });
  }
  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = verified.id; // Assuming the token contains a user ID
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid Token" });
  }
};
module.exports = authenticateUser;
