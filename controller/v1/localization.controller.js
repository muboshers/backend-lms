const mongoose = require("mongoose");
const localizationModel = require("../../model/v1/localization.model");

const CreateLocalization = async (req, res) => {
    try {
        // #swagger.tags = ['Localization']
        // #swagger.summary = "Create a localization"
        /* #swagger.security = [{
               "apiKeyAuth": []
       }] */
        const defaultLanguages = ["O'zbekcha", "English", "Русский"];
        if (!req.teachingCenterId)
            return res.status(400).json({message: "Xato urinish"});
        const {language_name, language} = req.body;

        const {logo_id, translation_file} = language;

        const isExistLanguage = await localizationModel.findOne({
            teaching_center_id: req.teachingCenterId,
            language_name,
            is_deleted: false,
        });

        if (defaultLanguages.includes(language_name) || isExistLanguage)
            return res.status(400).json({message: "This language alrady exist"});

        if (
            !mongoose.isValidObjectId(logo_id) ||
            !mongoose.isValidObjectId(translation_file)
        )
            res.status(403).json({message: "Invalid logo or translation file"});

        await localizationModel.create({
            teaching_center_id: req.teachingCenterId,
            language: {
                logo_id,
                translation_file,
            },
            language_name,
        });
        res.status(200).json({message: "Yangi til mufaqqiyatli qo'shildi"});
    } catch (err) {
        console.log(err);
        res.status(500).json({message: err.message});
    }
};

const GetLocalization = async (req, res) => {
    try {
        // #swagger.tags = ['Localization']
        // #swagger.summary = "Get localization file"
        /* #swagger.security = [{
               "apiKeyAuth": []
       }] */
        if (!req.teachingCenterId)
            return res.status(400).json({message: "Xato urinish"});

        const {language_name} = req.query;

        if (!language_name)
            return res.status(400).json({message: "Language name required"});

        const currentLanguage = await localizationModel
            .findOne({
                teaching_center_id: req.teachingCenterId,
                language_name,
                is_deleted: false,
            })
            .populate({
                path: "language",
                populate: [
                    {
                        path: "logo_id",
                        select: ["url", "filename"],
                        match: {
                            is_deleted: {
                                $ne: true,
                            },
                        },
                    },
                    {
                        path: "translation_file",
                        select: ["url", "filename"],
                        match: {
                            is_deleted: {
                                $ne: true,
                            },
                        },
                    },
                ],
            });

        if (!currentLanguage)
            res.status(400).json({message: "Language not found"});

        const url = currentLanguage?.language?.translation_file?.url;

        if (!url)
            return res.status(400).json({message: "Translation file not found"});

        fetch(url)
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                return res.status(200).json(data);
            })
            .catch(function (error) {
                console.log(error);
                return res.status(500).json({message: error.message});
            });
    } catch (err) {
        console.log(err);
        res.status(500).json({message: err.message});
    }
};

const GetTeachingCenterLanguages = async (req, res) => {
    try {
        // #swagger.tags = ['Localization']
        // #swagger.summary = "Get teaching center localization"
        /* #swagger.security = [{
              "apiKeyAuth": []
         }] */
        if (!req.teachingCenterId)
            return res.status(400).json({message: "O'quv markaz topilmadi"});

        const languages = await localizationModel
            .find({
                teaching_center_id: req.teachingCenterId,
                is_deleted: false,
            })
            .populate({
                path: "language",
                populate: [
                    {
                        path: "logo_id",
                        select: ["url", "filename"],
                        match: {
                            is_deleted: {
                                $ne: true,
                            },
                        },
                    },
                ],
            });

        res.status(200).json(languages);
    } catch (err) {
        console.log(err);
        res.status(500).json({message: err.message});
    }
};

module.exports = {
    CreateLocalization,
    GetLocalization,
    GetTeachingCenterLanguages,
};
