const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;

const generateToken = (args) => {
  try {
    const token = jwt.sign({ ...args }, JWT_SECRET, { expiresIn: "1D" });
    return token;
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  generateToken,
};
