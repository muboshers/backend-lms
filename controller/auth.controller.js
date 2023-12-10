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
          populate: {
            path: "logo",
            select: ["url"],
            match: {
              is_deleted: {
                $ne: true,
              },
            },
          },
        });

      if (!teacher)
        return res
          .status(400)
          .json({ message: "O'qituvchi ma'lumotlari topilmadi" });

      const isCorrectPassword = await checkPassword(
        req.body.password,
        teacher.password
      );

      if (!isCorrectPassword)
        return res.status(400).json({ message: "Parol to'gri emas!" });

      const token = await generateToken({
        _id: teacher._id,
        name: teacher.name,
        age: teacher?.age,
        role: ROLES.TEACHER,
        teaching_center_id: teacher.teaching_center_id._id,
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
        match: {
          is_deleted: {
            $ne: true,
          },
        },
      })
      .populate({
        path: "tg_bot",
        match: {
          is_deleted: {
            $ne: true,
          },
        },
      });

    if (!teaching_center)
      return res.status(400).json({ message: "O'quv markazi topilmadi" });

    const isCorrectPassword = await checkPassword(
      req.body.password,
      teaching_center.password
    );

    if (!isCorrectPassword)
      return res.status(400).json({ message: "Parol xato!" });

    const token = await generateToken({
      _id: teaching_center._id,
      name: teaching_center.name,
      address: teaching_center?.address,
      role: ROLES.DIRECTOR,
    });

    const { password, login, ...other } = teaching_center._doc;

    res.status(200).json({
      success: true,
      data: {
        token: token ?? "alooo",
        teaching_center: other,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(200).json({ message: error.message });
  }
};

const GetMeController = async (req, res) => {
  try {
    if (req.teacherId) {
      const teacher = await teacherModel.findById(req.teacherId).populate({
        path: "teaching_center_id",
        select: ["name", "address", "logo", "location"],
        populate: {
          path: "logo",
          select: ["url"],
          match: {
            is_deleted: {
              $ne: true,
            },
          },
        },
      });

      if (teacher.is_deleted || !teacher)
        return res
          .status(401)
          .json({ message: "O'quvtichi o'chirib tashlangan" });

      const token = await generateToken({
        _id: teacher._id,
        name: teacher.name,
        age: teacher?.age,
        role: ROLES.TEACHER,
        teaching_center_id: teacher.teaching_center_id._id,
      });
      res.status(200).json({
        data: {
          teacher: currentTeacher,
          token,
        },
      });
    }

    if (req.role !== ROLES.DIRECTOR && !req.teachingCenterId)
      throw new Error("Token muddati tugagan");

    const teachingCenter = await teachingCenterModel
      .findById(req.teachingCenterId)
      .populate({
        path: "logo",
        select: ["url"],
        match: {
          is_deleted: {
            $ne: true,
          },
        },
      })
      .populate({
        path: "tg_bot",
        match: {
          is_deleted: {
            $ne: true,
          },
        },
      })
      .select("name address location phone_number logo ");

    if (teachingCenter.is_deleted || !teachingCenter)
      return res
        .status(401)
        .json({ message: "O'quv markaz ma'lumotlari topilmadi" });

    const token = await generateToken({
      _id: teachingCenter._id,
      name: teachingCenter.name,
      address: teachingCenter?.address,
      role: ROLES.DIRECTOR,
    });

    const { password, login, ...other } = teachingCenter._doc;

    res.status(200).json({
      success: true,
      data: {
        teaching_center: other,
        token,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  LoginController,
  GetMeController,
};
