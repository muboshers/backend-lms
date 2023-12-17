const {default: mongoose} = require("mongoose");
const teacherModel = require("../../model/v1/teacher.model");
const topicModel = require("../../model/v1/topic.model");
const groupModel = require("../../model/v1/group.model");
const sectionModel = require("../../model/v1/section.model");
const pupilModel = require("../../model/v1/pupils.model");

const CreateTopicController = async (req, res) => {
    try {
        // #swagger.tags = ['Topic']
        // #swagger.summary = "Topic rcreate endpoint"
        /* #swagger.security = [{
             "apiKeyAuth": []
       }] */
        if (!req.teachingCenterId)
            return res.status(401).json({message: "Invalid credintials"});

        const {
            price,
            teacher_id,
            group_id,
            during_month,
            week_days,
            percentage,
            time_of_day,
            start_date,
        } = req.body;

        if (
            !mongoose.isValidObjectId(teacher_id) ||
            !mongoose.isValidObjectId(group_id)
        )
            return res.status(400).json({message: "Invalid teacher or group id"});

        const teacher = await teacherModel.findById(teacher_id);

        let currentGroup = await groupModel.findById(group_id);

        if (
            teacher &&
            !teacher.is_deleted &&
            teacher.teaching_center_id != req.teachingCenterId
        )
            return res.status(400).json({message: "No no no 😒"});

        const topic = await topicModel.create({
            price,
            teacher_id,
            during_month,
            percentage,
            start_date,
            time_of_day,
            week_days,
        });

        currentGroup.topics.unshift(topic._id);
        await currentGroup.save();
        res.status(200).json({message: "Topic created"});
    } catch (error) {
        console.log(error);
        res.status(500).json({message: error.message});
    }
};

const UpdateTopicController = async (req, res) => {
    try {
        // #swagger.tags = ['Topic']
        // #swagger.summary = "Topic update endpoint"
        /* #swagger.security = [{
             "apiKeyAuth": []
       }] */
        if (!req.teachingCenterId)
            return res.status(401).json({message: "Invalid credintials"});

        const {id} = req.params;

        const {
            price,
            teacher_id,
            during_month,
            week_days,
            percentage,
            time_of_day,
            start_date,
        } = req.body;

        if (!mongoose.isValidObjectId(teacher_id) || !mongoose.isValidObjectId(id))
            return res.status(400).json({message: "Invalid  id"});

        const teacher = await teacherModel.findById(teacher_id);

        if (
            teacher &&
            !teacher.is_deleted &&
            teacher.teaching_center_id.toString() !== req.teachingCenterId
        )
            return res.status(400).json({message: "No no no 😒"});

        let currentTopic = await topicModel.findById(id);

        if (!currentTopic) throw new Error("Topic not found");

        if (currentTopic?.is_deleted)
            throw new Error("This topic removed you can not update this topics");
        currentTopic.price = price ?? currentTopic?.price;
        currentTopic.during_month = during_month ?? currentTopic?.during_month;
        currentTopic.week_days = week_days ?? currentTopic?.week_days;
        currentTopic.percentage = percentage ?? currentTopic?.percentage;
        currentTopic.time_of_day = time_of_day ?? currentTopic?.time_of_day;
        currentTopic.start_date = start_date ?? currentTopic?.start_date;
        await currentTopic.save();
        res.status(200).json({message: "Topic update"});
    } catch (error) {
        console.log(error);
        res.status(500).json({message: error.message});
    }
};

const DeleteTopicController = async (req, res) => {
    try {
        // #swagger.tags = ['Topic']
        // #swagger.summary = "Topic delete endpoint"
        /* #swagger.security = [{
             "apiKeyAuth": []
       }] */
        if (!req.teachingCenterId)
            return res.status(401).json({message: "Invalid credintials"});

        const {id} = req.params;

        if (!mongoose.isValidObjectId(id))
            return res.status(400).json({message: "Invalid  id"});

        let currentTopic = await topicModel.findById(id);

        const teacher = await teacherModel.findById(
            currentTopic?.teaching_center_id
        );

        if (
            teacher &&
            !teacher.is_deleted &&
            teacher.teaching_center_id.toString() !== req.teachingCenterId
        )
            return res.status(400).json({message: "No no no 😒"});

        if (currentTopic?.is_deleted) throw new Error("This topic alrady removed");

        currentTopic.is_deleted = true;
        await currentTopic.save();
        res.status(200).json({message: "Topic deleted"});
    } catch (error) {
        console.log(error);
        res.status(500).json({message: error.message});
    }
};

const GetTopicListByTeacherIdController = async (req, res) => {
    try {
        // #swagger.tags = ['Topic']
        // #swagger.summary = "Get Topic list by Teacher id"
        /* #swagger.security = [{
                     "apiKeyAuth": []
         }] */
        const {teacher_id} = req.params;

        if (!req.teachingCenterId || !mongoose.isValidObjectId(teacher_id))
            return res.status(401).json({message: "Invalid credintials"});

        const {page = 1, limit = 10, search} = req.query;

        const skip = (page - 1) * limit;

        let query = topicModel.find({
            is_deleted: false,
            teacher_id,
        });
        // .populate({
        //   path: "sections",
        //   select: ["name", "reports"],
        //   populate: {
        //     path: "sections.reports",
        //     select: ["pupil_id", "message", "type", "status"],
        //     populate: {
        //       path: "sections.reports.pupil_id",
        //     },
        //   },
        // });

        if (search) {
            query = query
                .where("is_deleted")
                .equals(false)
                .where("teacher_id")
                .equals(teacher_id)
                .where("price")
                .regex(new RegExp(search, "i"));
            // .populate({
            //   path: "sections",
            //   select: ["name", "reports"],
            //   populate: {
            //     path: "sections.reports",
            //     select: ["pupil_id", "message", "type", "status"],
            //     populate: {
            //       path: "sections.reports.pupil_id",
            //     },
            //   },
            // });
        }

        const topicList = await query.skip(skip).limit(limit).exec();

        const count = await teacherModel.countDocuments(query.getFilter());

        res.status(200).json({
            data: topicList,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({message: error.message});
    }
};

const CreateSectionToTopic = async (req, res) => {
    try {

        // #swagger.tags = ['Topic']
        // #swagger.summary = "Create section for topic"
        /* #swagger.security = [{
             "apiKeyAuth": []
       }] */
        const {topicId} = req.params;

        const {name} = req.body;

        if (!req.teachingCenterId)
            return res.status(404).json({message: "Invalid teaching center id"})

        if (!mongoose.isValidObjectId(topicId))
            return res.status(404).json({message: "Invalid topic id"})

        let currentTopic = await topicModel.findById(topicId).populate({
            path: "teacher_id",
            match: {
                is_deleted: {
                    $ne: true,
                },
            },
        })

        let existSectionName = await sectionModel.findOne({name})
        if (currentTopic?.is_deleted)
            return res.status(400).json({message: "This topic removed"})

        if (!currentTopic.teacher_id || currentTopic.teacher_id.is_deleted)
            return res.status(400).json({message: "Please restore teacher or create another teacher"})

        if (existSectionName && currentTopic?.sections.includes(existSectionName._id))
            return res.status(400).json({message: "Please use another name this name already use"})

        const section = await sectionModel.create({
            name,
            teacher_id: currentTopic.teacher_id._id
        })
        currentTopic.sections.unshift(section._id)
        await currentTopic.save()
        res.status(200).json({message: "Section create successfully"})
    } catch (error) {
        console.log(error);
        res.status(500).json({message: error.message});
    }
}

const GetTopicSectionsByTopicId = async (req, res) => {
    try {
        // #swagger.tags = ['Topic']
        // #swagger.summary = "Get topic sections by topic id"
        /* #swagger.security = [{
             "apiKeyAuth": []
       }] */

        if (!req.teachingCenterId)
            return res.status(404).json({message: "Invalid teaching center id"})

        const {topicId} = req.params;

        const {page = 1, limit = 10, search = ""} = req.query

        const skip = (page - 1) * limit;

        if (!mongoose.isValidObjectId(topicId))
            return res.status(400).json({message: 'Invalid topic id'})

        const currentTopic = await topicModel.findById(topicId);

        if (currentTopic.is_deleted)
            return res.status(400).json({message: "This topic was deleted"})

        let query = sectionModel.find({
            _id: {$in: currentTopic.sections},
            is_deleted: false,
        })

        if (search) {
            query = query
                .where("is_deleted")
                .equals(false)
                .where("name")
                .regex(new RegExp(search, "i"))
        }


        const sectionList = await query.skip(skip).limit(limit).exec();
        const totalCount = await sectionModel.countDocuments(query.getFilter());

        res.status(200).json({
            totalCount,
            sectionList,
            totalPages: Math.ceil(totalCount / limit),
            currentPage: page,
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({message: error.message});
    }
}

module.exports = {
    CreateTopicController,
    UpdateTopicController,
    DeleteTopicController,
    GetTopicListByTeacherIdController,
    CreateSectionToTopic,
    GetTopicSectionsByTopicId
};
