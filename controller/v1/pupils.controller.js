const {default: mongoose} = require("mongoose");
const pupilModel = require("../../model/v1/pupils.model");
const topicModel = require("../../model/v1/topic.model");
const teachingCenterModel = require("../../model/v1/teaching-center.model");

const CreatePupilsController = async (req, res) => {
    try {
        // #swagger.tags = ['Pupils']
        // #swagger.summary = "Create pupils create endpont"
        /* #swagger.security = [{
            "apiKeyAuth": []
        }] */
        if (!req.teachingCenterId) throw new Error("Un authorized");

        const {name, age, parent_contact_information, topic_id} = req.body;

        const count = await pupilModel.countDocuments({parent_contact_information});

        if (count === 1)
            return res.status(400).json({message: "User is already exist"})

        const pupils = await pupilModel.create({
            name,
            age,
            parent_contact_information,
            teaching_center_id: req.teachingCenterId,
        });

        if (topic_id) {
            await topicModel.findOneAndUpdate(
                {_id: topic_id},
                {$addToSet: {pupils: pupils?._id}},
            );
        }

        res.status(200).json({message: "Pupils created"});
    } catch (error) {
        console.log(error);
        res.status(500).json({message: error.message});
    }
};

const UpdatePupilsController = async (req, res) => {
    try {
        // #swagger.tags = ['Pupils']
        // #swagger.summary = "Update pupils"
        /* #swagger.security = [{
            "apiKeyAuth": []
        }] */
        const {id} = req.params;

        const {name, address, age, parent_contact_information} = req.body;

        if (!req.teachingCenterId) throw new Error("Un authorized");

        if (!mongoose.isValidObjectId(id))
            throw new Error("Invalid teacher or group or pupils id");

        let currentPupils = await pupilModel.findById(id);

        if (currentPupils.is_deleted)
            throw new Error("This pupils removed you cann't update");

        if (currentPupils?.teaching_center_id.toString() !== req.teachingCenterId)
            throw new Error("You update your own students information");

        currentPupils.name = name ?? currentPupils?.name;
        currentPupils.address = address ?? currentPupils?.address;
        currentPupils.age = age ?? currentPupils?.age;
        currentPupils.parent_contact_information =
            parent_contact_information ?? currentPupils?.parent_contact_information;

        await currentPupils.save();
        res.status(200).json({message: "Pupils information update"});
    } catch (error) {
        console.log(error);
        res.status(500).json({message: error.message});
    }
};

const DeletePupilsController = async (req, res) => {
    try {
        // #swagger.tags = ['Pupils']
        // #swagger.summary = "Delete pupils"
        /* #swagger.security = [{
            "apiKeyAuth": []
        }] */
        const {id} = req.params;

        const {topic_id = null} = req.body;

        if (!req.teachingCenterId) throw new Error("Un authorized");

        if (!mongoose.isValidObjectId(id))
            throw new Error("Invalid teacher or group or pupils id");

        let currentPupils = await pupilModel.findById(id);

        if (currentPupils.is_deleted)
            throw new Error("This pupils removed you cann't update");

        if (currentPupils?.teaching_center_id.toString() !== req.teachingCenterId)
            throw new Error("You update your own students information");

        if (topic_id) {
            await topicModel.findOneAndUpdate(
                {_id: topic_id},
                {$pop: {pupils: id}},
            );
        }

        currentPupils.is_deleted = true;
        await currentPupils.save();
        res.status(200).json({message: "Pupils deleted successfully"});
    } catch (error) {
        console.log(error);
        res.status(500).json({message: error.message});
    }
};

const GetPupilsListPupilsController = async (req, res) => {
    try {
        // #swagger.tags = ['Pupils']
        // #swagger.summary = "Get list pupils"
        /* #swagger.security = [{
            "apiKeyAuth": []
        }] */
        const {page = 1, limit = 15, search} = req.query;

        if (!req.teachingCenterId) throw new Error("Un authorized");

        const skip = (page - 1) * limit;

        let query = pupilModel.find({
            teaching_center_id: new mongoose.Types.ObjectId(req.teachingCenterId),
            is_deleted: false,
        });


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

        const pupilsList = await query.skip(skip).limit(limit).exec();

        const count = await pupilModel.countDocuments(query.getFilter());


        res.status(200).json({
            data: pupilsList,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
            totalCount: count
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({message: error.message});
    }
};


const GetPupilsByTopicId = async (req, res) => {
    try {
        // #swagger.tags = ['Pupils']
        // #swagger.summary = "Get pupils by topic id"
        /* #swagger.security = [{
            "apiKeyAuth": []
        }] */

        const {topicId} = req.params;

        const {page = 1, limit = 10, search} = req.query;

        const skip = (page - 1) * limit;

        if (!req.teachingCenterId)
            return res.status(400).json({message: "Invalid teaching center id"})

        if (!mongoose.isValidObjectId(topicId))
            return res.status(404).json({message: "Invalid topic id"})

        const currentTopic = await topicModel.findById(topicId).populate({
            path: 'teacher_id',
            select: ['name']
        })

        if (!currentTopic || currentTopic.is_deleted)
            return res.status(404).json({message: "Topic not exist"})

        let query = pupilModel.find({
            _id: {$in: currentTopic.pupils},
            is_deleted: false,
        });

        if (search) {
            query = query
                .where("is_deleted")
                .equals(false)
                .where("name")
                .regex(new RegExp(search, "i"))
        }
        const pupilsList = await query.skip(skip).limit(limit).exec();

        const count = await pupilModel.countDocuments(query.getFilter());

        res.status(200).json({
            data: pupilsList,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
            totalCount: count,
            topic: currentTopic,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({message: error.message});
    }
}

module.exports = {
    CreatePupilsController,
    UpdatePupilsController,
    DeletePupilsController,
    GetPupilsListPupilsController,
    GetPupilsByTopicId,
};
