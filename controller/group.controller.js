const groupModel = require("../model/group.model");
const {ROLES} = require("../constants");
const {default: mongoose} = require("mongoose");
const fileModel = require("../model/file.model");
const topicModel = require("../model/topic.model");

const CreateGroupController = async (req, res) => {
    try {
        if (!req.teachingCenterId || req.role !== ROLES.DIRECTOR)
            return res.status(400).json({message: "Invalid credintials"});

        let topicIds = [];

        const {image, name, topics} = req.body;

        if (image && !mongoose.isValidObjectId(image))
            return res.status(400).json({message: "Invalid image id"});

        const isExistGroup = await groupModel.find({
            name,
            teaching_center_id: req.teachingCenterId,
        });

        if (isExistGroup.name === name)
            return res.status(400).json({
                message: "This group alrady exist please create another group",
            });

        for await (let topic of topics) {
            if (!mongoose.isValidObjectId(topic?.teacher_id))
                return res.status(400).json({message: "Invalid teacher"});

            const {
                teacher_id,
                price,
                percentage,
                week_days,
                start_date,
                during_month,
                time_of_day,
            } = topic;

            const newTopic = await topicModel.create({
                teacher_id,
                price,
                percentage,
                week_days,
                start_date,
                week_days,
                during_month,
                time_of_day,
            });

            topicIds.unshift(newTopic._id);
        }

        await groupModel.create({
            name,
            image: !!image ? image : "654625ad0398406e87556a16",
            teaching_center_id: req.teachingCenterId,
            topics: topicIds,
        });

        res.status(200).json({message: "Successfully created"});
    } catch (err) {
        console.log(err);
        res.status(500).json({message: err.message});
    }
};

const UpdateGroupController = async (req, res) => {
    try {
        const {id} = req.params;

        const {image, name} = req.body;

        if (!req.teachingCenterId || req.role !== ROLES.DIRECTOR)
            return res.status(400).json({message: "Invalid credintials"});

        if (!mongoose.isValidObjectId(id) || !mongoose.isValidObjectId(image))
            return res.status(404).json({message: "Invalid id"});

        let currentGroup = await groupModel.findById(id);

        if (currentGroup.is_deleted)
            return res
                .status(400)
                .json({message: "This group deleted you can not update information"});

        if (req.teachingCenterId !== currentGroup?.teaching_center_id.toString())
            return res.status(423).json({
                message: "You can only update your own teaching center groups",
            });

        if (image !== currentGroup?.image.toString()) {
            await fileModel.findByIdAndUpdate(currentGroup?.image, {
                $set: {is_deleted: true},
            });
        }

        currentGroup.name = name ?? currentGroup?.name;
        currentGroup.image = image ?? currentGroup?.image;
        await currentGroup.save();
        res.status(200).json({message: "Group Information Update successfully"});
    } catch (error) {
        console.log(error);
        return res.status(500).json({message: error.message});
    }
};

const DeleteGroupController = async (req, res) => {
    try {
        const {id} = req.params;

        if (!req.teachingCenterId || req.role !== ROLES.DIRECTOR)
            return res.status(400).json({message: "Invalid credintials"});

        if (!mongoose.isValidObjectId(id))
            return res.status(404).json({message: "Invalid id"});

        let currentGroup = await groupModel.findById(id);

        if (currentGroup.is_deleted)
            return res.status(400).json({message: "This group alrady removed"});

        if (req.teachingCenterId !== currentGroup?.teaching_center_id.toString())
            return res.status(423).json({
                message: "You can only delete your own teaching center groups",
            });

        currentGroup.is_deleted = true;

        await currentGroup.save();

        res.status(200).json({message: "Group was deleted"});
    } catch (error) {
        console.log(error);
        return res.status(500).json({message: error.message});
    }
};

const GetGroupListController = async (req, res) => {
    try {
        if (!req.teachingCenterId)
            return res.status(400).json({message: "Invalid credintials"});

        const {page = 1, limit = 15, search} = req.query;

        const skip = (page - 1) * limit;

        let query = groupModel
            .find({
                teaching_center_id: req.teachingCenterId,
                is_deleted: false,
            })
            .populate({
                path: "image",
                select: ["url"],
                match: {
                    is_deleted: {
                        $ne: true,
                    },
                },
            })
            .populate({
                path: "topics",
                select: ["pupils"],
                match: {
                    is_deleted: {
                        $ne: true,
                    },
                },
            });

        if (search) {
            query = query
                .where("teaching_center_id")
                .equals(req.teachingCenterId)
                .where("is_deleted")
                .equals(false)
                .where("name")
                .regex(new RegExp(search, "i"))
                .populate({
                    path: "image",
                    select: ["url"],
                    match: {
                        is_deleted: {
                            $ne: true,
                        },
                    },
                })
                .populate({
                    path: "topics",
                    select: ["pupils"],
                    match: {
                        is_deleted: {
                            $ne: true,
                        },
                    },
                });
        }

        const groupList = await query.skip(skip).limit(limit).exec();

        const count = await groupModel.countDocuments(query.getFilter());

        res.status(200).json({
            data: groupList,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({message: error.message});
    }
};

const GetGroupByIdController = async (req, res) => {
    try {
        const {id} = req.params;

        if (!mongoose.isValidObjectId)
            return res.status(404).json({message: "Mavjud bo'lmagan guruh idsi"});

        const currentGroup = await groupModel
            .findById(id)
            .populate({
                path: "image",
                select: ["url"],
                match: {
                    is_deleted: {
                        $ne: true,
                    },
                },
            })
            .populate({
                path: "topics",
                match: {
                    is_deleted: {
                        $ne: true,
                    },
                },
                populate: {
                    path: 'teacher_id',
                    select: ['name', "phone_number"],
                    match: {
                        is_deleted: {
                            $ne: true,
                        },
                    },
                },
            });

        if (!currentGroup)
            return res.status(404).json({message: "Guruh topilmadi"});

        if (
            currentGroup.teaching_center_id != req.teachingCenterId ||
            currentGroup?.is_deleted
        )
            return res.status(400).json({
                message: "Guruh o'chirib tashlangan yoki mabjud bo'lmagan guruh",
            });

        res.status(200).json({
            success: true,
            data: currentGroup,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({message: error.message});
    }
};

module.exports = {
    CreateGroupController,
    UpdateGroupController,
    DeleteGroupController,
    GetGroupByIdController,
    GetGroupListController,
};
