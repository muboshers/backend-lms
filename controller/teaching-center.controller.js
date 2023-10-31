const mongoose = require("mongoose");

const { generatePassword } = require("../utils/password");

const teachingCenterModel = require("../model/teaching-center.model");
const fileModel = require("../model/file.model");

const createTeachingCenterAdminController = async (req, res) => {
  try {
    const { branch, image_id, password } = req.body;

    if (branch?.length >= 1) {
      for (let index = 0; index < branch.length; index++) {
        if (!mongoose.isValidObjectId(branch[index]))
          return res.status(400).json({ message: "Invalid branch id" });
      }
    }

    if (image_id && !mongoose.isValidObjectId(image_id))
      return res.status(400).json({ message: "Invalid image id" });

    const hashedPassword = await generatePassword(password);

    await teachingCenterModel.create({
      ...req.body,
      password: hashedPassword,
      logo: image_id,
    });

    res.status(200).json({ message: "Teaching center created succesfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateTeachingCenterAdminController = async (req, res) => {
  try {
    const { branch, image_id, password } = req.body;

    const { id } = req.params;

    if (!mongoose.isValidObjectId(id))
      return res.status(404).json({ message: "Invalid teaching center id" });

    const currentTeachingCenter = await teachingCenterModel.findById(id);
    if (branch?.length >= 1) {
      for (let index = 0; index < branch.length; index++) {
        if (!mongoose.isValidObjectId(branch[index]))
          return res.status(400).json({ message: "Invalid branch id" });
      }
    }

    if (image_id && !mongoose.isValidObjectId(image_id))
      return res.status(400).json({ message: "Invalid image id" });

    if (password !== currentTeachingCenter.password) {
      req.body.password = await generatePassword(password);
    }

    
    if (image_id !== currentTeachingCenter.logo) {
      await fileModel.findByIdAndUpdate(currentTeachingCenter.logo, {
        $set: { is_deleted: true },
      });
    }

    await teachingCenterModel.findByIdAndUpdate(id, {
      $set: { ...req.body, logo: req.body.image_id },
    });
    res.status(200).json({ message: "Teaching center update" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteTeachingCenterAdminController = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id))
      return res.status(404).json({ message: "Invalid teaching center id" });

    await teachingCenterModel.findByIdAndUpdate(id, { is_deleted: true });

    res.status(200).json({ message: "Teaching center deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getTeachingCenterAdminController = async (req, res) => {
  try {
    const { page = 1, limit = 10, search } = req.query;
    const skip = (page - 1) * limit;
    let query = teachingCenterModel.find({ is_deleted: false }).populate({
      path: "logo",
      select: ["url"],
    });

    if (search) {
      query = query.where("name").regex(new RegExp(search, "i")).populate({
        path: "logo",
      });
    }

    const teachingCentersList = await query.skip(skip).limit(limit).exec();

    const count = await teachingCenterModel.countDocuments(query.getFilter());

    res.status(200).json({
      data: teachingCentersList,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const GetByIdOrMeTeachingCenterController = async (req, res) => {
  try {
    const id = req.params?.id || req.teachingCenterId;
    if (!mongoose.isValidObjectId(id))
      return res.status(404).json({ message: "Invalid teaching center id" });
    const currenTeachingCenter = await teachingCenterModel
      .findById(id)
      .populate({
        path: "logo",
        select: ["url"],
      });
    res.status(200).json(currenTeachingCenter);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createTeachingCenterAdminController,
  updateTeachingCenterAdminController,
  deleteTeachingCenterAdminController,
  getTeachingCenterAdminController,
  GetByIdOrMeTeachingCenterController,
};