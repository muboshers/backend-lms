const {default: mongoose} = require("mongoose");
const pupilModel = require("../model/pupils.model");

const CreatePupilsController = async (req, res) => {
    try {
        // #swagger.tags = ['Pupils']
        // #swagger.summary = "Create pupils create endpont"
        /* #swagger.security = [{
            "apiKeyAuth": []
        }] */
        if (!req.teachingCenterId) throw new Error("Un authorized");

        const {name, address, age, parent_contact_information} = req.body;

        await pupilModel.create({
            name,
            age,
            parent_contact_information,
            address,
            teaching_center_id: req.teachingCenterId,
        });

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

        if (!req.teachingCenterId) throw new Error("Un authorized");

        if (!mongoose.isValidObjectId(id))
            throw new Error("Invalid teacher or group or pupils id");

        let currentPupils = await pupilModel.findById(id);

        if (currentPupils.is_deleted)
            throw new Error("This pupils removed you cann't update");

        if (currentPupils?.teaching_center_id.toString() !== req.teachingCenterId)
            throw new Error("You update your own students information");

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
        const {page = 1, limit = 10, search} = req.query;

        if (!req.teachingCenterId) throw new Error("Un authorized");

        const skip = (page - 1) * limit;

        let query = pupilModel.find({
            teaching_center_id: req.teachingCenterId,
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

        const count = await teacherModel.countDocuments(query.getFilter());

        res.status(200).json({
            data: pupilsList,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({message: error.message});
    }
};

module.exports = {
    CreatePupilsController,
    UpdatePupilsController,
    DeletePupilsController,
    GetPupilsListPupilsController,
};
