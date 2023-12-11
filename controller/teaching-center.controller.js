const mongoose = require("mongoose");
const { generatePassword } = require("../utils/password");

const teachingCenterModel = require("../model/teaching-center.model");

const fileModel = require("../model/file.model");

const teacherModel = require("../model/teacher.model");
const botModel = require("../model/bot.model");
const newBot = require("../middleware/bot");

const createTeachingCenterAdminController = async (req, res) => {
  try {
    const { branch, login, image_id, password } = req.body;

    const isExistTeachingCenterLoginName = await teachingCenterModel.findOne({
      login,
    });

    const isExistTeacherLoginName = await teacherModel.findOne({ login });

    if (isExistTeacherLoginName || isExistTeachingCenterLoginName)
      return res.status(500).json({
        message: "This login name alrady exist please write another login",
      });

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
      login,
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

    if (currentTeachingCenter.is_deleted)
      throw new Error("This teaching center deleted you can not edit ");

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

    if (req.body.login) {
      const isExistTeachingCenterLoginName = await teachingCenterModel.findOne({
        login: req.body.login,
      });

      const isExistTeacherLoginName = await teacherModel.findOne({
        login: req.body.login,
      });

      if (isExistTeacherLoginName || isExistTeachingCenterLoginName._id !== id)
        return res.status(500).json({
          message: "This login name alrady exist please write another login",
        });
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

    if (!req.mainAdmin)
      return res.status(401).json({ message: "Invalid credintials" });

    if (!mongoose.isValidObjectId(id))
      return res.status(404).json({ message: "Invalid teaching center id" });

    let currentTeachingCenter = await teachingCenterModel.findById(id);

    if (currentTeachingCenter?.is_deleted)
      throw new Error(
        "This teaching center removed you can not update this information"
      );

    currentTeachingCenter.is_deleted = true;
    await currentTeachingCenter.save();
    res.status(200).json({ message: "Teaching center deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const teachingCenterUpdateController = async (req, res) => {
  try {
    let bot;

    if (!req.teachingCenterId)
      return res.status(400).json({ message: "No no no 😒" });

    let currentTeachingCenter = await teachingCenterModel.findById(
      req.teachingCenterId
    );

    if (currentTeachingCenter.is_deleted)
      return res
        .status(404)
        .json({ message: "O'quv markaz topilmadi yoki o'chirib tashlangan" });

    const { name, address, location, logo } = req.body;

    currentTeachingCenter.logo = logo;
    currentTeachingCenter.address = address;
    currentTeachingCenter.location = location;
    currentTeachingCenter.name = name;
    currentTeachingCenter.tg_bot = bot?._id;
    await currentTeachingCenter.save();
    res.status(200).json(currentTeachingCenter);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

const UpdateTeachingCenterTgBotController = async (req, res) => {
  try {
    const { tg_bot_token, greeting_message } = req.body;

    if (!req.teachingCenterId)
      return res.status(400).json({ message: "No no no 😒😒" });

    if (!greeting_message.includes("{{tg_user_name}}"))
      return res.status(400).json({ message: "No no no 😒😒" });

    let currentTeachingCenter = await teachingCenterModel.findById(
      req.teachingCenterId
    );

    if (!currentTeachingCenter || currentTeachingCenter.is_deleted)
      return res
        .status(400)
        .json({ message: "O'quv markaz topilmadi yoki o'chirib tashlangan" });

    let existBot = await botModel.findById(
      currentTeachingCenter?.tg_bot?.toString()
    );
    let isChangeBot = existBot?.token !== tg_bot_token;
    if (existBot) {
      if (isChangeBot) {
        const oldTgBot = newBot(existBot?.token);

        await oldTgBot.deleteWebHook();

        const newTgBot = newBot(tg_bot_token);

        await newTgBot.setWebHook(
          `https://lms-management.vercel.app/v1/api/telegram/${tg_bot_token}?max_connections=140`
        );
      }

      existBot.token = tg_bot_token;
      existBot.greeting_message = greeting_message;
      await existBot.save();
      return res.status(200).json({ message: "Tg bot succesfully joined" });
    } else {
      const bot = await botModel.create({
        token: tg_bot_token,
        greeting_message,
      });

      const tg_bot = newBot(tg_bot_token);
      tg_bot.setWebHook(
        `https://lms-management.vercel.app/v1/api/telegram/${tg_bot_token}?max_connections=140`
      );
      currentTeachingCenter.tg_bot = bot._id.toString();
      await currentTeachingCenter.save();
      return res.status(200).json({ message: "Tg bot succesfully joined" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

const getTeachingCenterAdminController = async (req, res) => {
  try {
    const { page = 1, limit = 10, search } = req.query;
    const skip = (page - 1) * limit;

    let query = teachingCenterModel
      .find({ is_deleted: false })
      .populate({
        path: "logo",
        select: ["url"],
      })
      .populate({
        path: "branch",
        select: [
          "name",
          "address",
          "location",
          "phone_number",
          "createdAt",
          "updatedAt",
        ],
      })
      .select("name address location phone_number createdAt updatedAt");

    if (search) {
      query = query
        .where("is_deleted")
        .equals(false)
        .where("name")
        .regex(new RegExp(search, "i"))
        .populate({
          path: "logo",
          select: ["url"],
        })
        .populate({
          path: "branch",
          select: [
            "name",
            "address",
            "location",
            "phone_number",
            "createdAt",
            "updatedAt",
          ],
        })
        .select("name address location phone_number createdAt updatedAt");
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
      })
      .populate({
        path: "branch",
        select: [
          "name",
          "address",
          "location",
          "phone_number",
          "createdAt",
          "updatedAt",
        ],
      })
      .select("name address location phone_number createdAt updatedAt");

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
  teachingCenterUpdateController,
  UpdateTeachingCenterTgBotController,
};
