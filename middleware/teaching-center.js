const jwt = require("jsonwebtoken");
const { ROLES } = require("../constants");

const JWT_SECRET = process.env.JWT_SECRET;

const TEACHING_CENTER_OR_TEACHERS = (req, res, next) => {
  try {
    const token = req?.headers?.authorization?.split(" ")[1];

    if (!token) throw new Error("Token not found");

    const data = jwt.verify(token, JWT_SECRET);

    if (data.role === ROLES.DIRECTOR) {
      req.teachingCenterId = data._id;
    } else {
      req.teacherId = data._id;
      req.teachingCenterId = data.teaching_center_id;
    }
    req.role = data.role;
    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = TEACHING_CENTER_OR_TEACHERS;
