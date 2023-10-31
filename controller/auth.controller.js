const { ROLES } = require("../constants");

const teacherModel = require("../model/teacher.model");
const teachingCenterModel = require("../model/teaching-center.model");

const { checkPassword } = require("../utils/password");

const { generateToken } = require("../utils/token");

const LoginController = async (req, res) => {
  try {
    const { is_teacher } = req.body;
    if (is_teacher) {
      const teacher = await teacherModel
        .findOne({ login: req.body.login })
        .populate({
          path: "teaching_center_id",
          select: ["name", "address", "logo", "location"],
        });

      if (!teacher)
        return res.status(400).json({ message: "Teacher not found!" });

      const isCorrectPassword = await checkPassword(
        req.body.password,
        teacher.password
      );

      if (!isCorrectPassword)
        return res.status(400).json({ message: "Incorrect password" });

      const token = generateToken({
        _id: teacher._id,
        name: teacher.name,
        age: teacher?.age,
        role: ROLES.TEACHER,
      });

      const { password, ...other } = teacher._doc;

      res.status(200).json({
        success: true,
        data: {
          token,
          user: other,
        },
      });
    }

    const teaching_center = await teachingCenterModel
      .findOne({ login: req.body.login })
      .populate({
        path: "logo",
        select: ["url"],
      });

    if (!teaching_center)
      return res.status(400).json({ message: "Teaching center not found!" });

    const isCorrectPassword = await checkPassword(
      req.body.password,
      teaching_center.password
    );

    if (!isCorrectPassword)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = generateToken({
      _id: teaching_center._id,
      name: teaching_center.name,
      address: teaching_center?.address,
      role: ROLES.DIRECTOR,
    });

    const { password, login, ...other } = teaching_center._doc;

    res.status(200).json({
      success: true,
      data: {
        token,
        teaching_center: other,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(200).json({ message: error.message });
  }
};

module.exports = {
  LoginController,
};
