const { default: mongoose } = require("mongoose");
const { ROLES } = require("../constants");
const degreesModel = require("../model/degree.model");
const teacherModel = require("../model/teacher.model");
const teachingCenterModel = require("../model/teaching-center.model");
const { generatePassword } = require("../utils/password");

const CreateTeacherController = async (req, res) => {
  try {
    if (
      (!req.teachingCenterId && !req.mainAdmin) ||
      (req.role !== ROLES.DIRECTOR && !req.mainAdmin)
    )
      return res.status(401).json({ message: "Un authorized" });

    let degreeIDS = [];

    const { name, age, phone_number, login, password, degree } = req.body;

    const isExistTeachingCenterLoginName = await teachingCenterModel.findOne({
      login,
    });

    const isExistTeacherLoginName = await teacherModel.findOne({ login });

    if (isExistTeacherLoginName || isExistTeachingCenterLoginName)
      return res.status(500).json({
        message: "This login name alrady exist please write another login",
      });

    for await (let degre of degree) {
      const cert = await degreesModel.create({
        key: degre.key,
        value: degre.value,
        image: degre.image_id,
      });

      degreeIDS = [...degreeIDS, cert._id];
    }

    const hashedPassword = await generatePassword(password);

    await teacherModel.create({
      name,
      phone_number,
      login,
      age,
      degree: degreeIDS,
      password: hashedPassword,
      teaching_center_id: req.teachingCenterId,
    });

    res.status(200).json({ message: "Teacher add succesfully " });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const TeacherUpdateController = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id))
      return res.status(400).json({ message: "Invalid id" });

    const currentTeacher = await teacherModel.findById(id);

    const isTeachingCenter =
      req.teachingCenterId === currentTeacher?.teaching_center_id.toString();

    const isMainAdmin = req.mainAdmin;

    const isTeacherOnly = isTeachingCenter && req.role === ROLES.TEACHER;

    const isAuthenticatedError =
      !!isTeachingCenter || !!isMainAdmin || !!isTeacherOnly;

    if (!isAuthenticatedError)
      return res.status(400).json({ message: "Invalid credintials" });

    let { degree, ...other } = req.body;

    if (req.body.password) {
      other.password = await generatePassword(req.body.password);
    }

    for await (let degre of degree) {
      await degreesModel.findByIdAndUpdate(degre._id, {
        $set: {
          ...degre,
        },
      });
    }

    await teacherModel.findByIdAndUpdate(id, {
      $set: {
        ...other,
      },
    });

    res.status(200).json({
      message: "Teacher information update",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

const TeacherDeleteController = async (req, res) => {
  try {
    const { id } = req.params;

    if (!req.teachingCenterId && !req.mainAdmin)
      return res.status(400).json({ message: "Invalid credintials" });

    if (!mongoose.isValidObjectId(id))
      return res.status(400).json({ message: "Invalid teacher id" });

    let currentTeacher = await teacherModel.findById(id);

    if (!currentTeacher)
      return res.status(404).json({ message: "Teacher not found" });

    if (req.teachingCenterId != currentTeacher?.teaching_center_id)
      return res.status(400).json({ message: "No no no 😒" });

    currentTeacher.is_deleted = true;
    await currentTeacher.save();

    res.status(200).json({ message: "Teacher was deleted" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

const GetTeachersListController = async (req, res) => {
  try {
    if (!req.teachingCenterId)
      return res.status(400).json({ message: "Invalid credintials" });

    const { page = 1, limit = 10, search } = req.query;

    const skip = (page - 1) * limit;

    let query = teacherModel
      .find({
        is_deleted: false,
        teaching_center_id: req.teachingCenterId,
      })
      .select("name phone_number age teaching_center_id");

    if (search) {
      query = query
        .where("teaching_center_id")
        .equals(req.teachingCenterId)
        .where("is_deleted")
        .equals(false)
        .where("name")
        .regex(new RegExp(search, "i"))
        .select("name phone_number age teaching_center_id");
    }

    const teachersList = await query.skip(skip).limit(limit).exec();

    const count = await teacherModel.countDocuments(query.getFilter());

    res.status(200).json({
      data: teachersList,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  CreateTeacherController,
  TeacherUpdateController,
  TeacherDeleteController,
  GetTeachersListController,
};
