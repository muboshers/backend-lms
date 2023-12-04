const { ref, getDownloadURL, uploadBytes } = require("firebase/storage");
const { storage } = require("../firebase.config");
const fileModel = require("../model/file.model");

const MultipleFileUploadController = async (req, res) => {
  try {
    let filesIds = [];
    for await (let file of req.files) {
      const storageRef = ref(storage, `/files/${file.originalname}`);

      await uploadBytes(storageRef, file.buffer)
        .then((snapshot) => {
          return getDownloadURL(ref(storage, snapshot.metadata.fullPath));
        })
        .then(async (url) => {
          const uploadedFile = await fileModel.create({
            url,
            filename: file.originalname,
            file_type: file.type,
            teaching_center_id: req.teachingCenterId,
          });
          filesIds.push(uploadedFile._id);
        });
    }

    res.status(200).json({ message: "Successfully upload", data: filesIds });
  } catch (error) {
    console.log(error);
    return res.status(500).json(error.message);
  }
};

const SingleFileUploadController = async (req, res) => {
  try {
    const file = req.file;
    const storageRef = ref(storage, `/files/${file.originalname}`);
    await uploadBytes(storageRef, file.buffer)
      .then((snapshot) => {
        return getDownloadURL(ref(storage, snapshot.metadata.fullPath));
      })
      .then(async (url) => {
        const uploadedFile = await fileModel.create({
          url,
          filename: file.originalname,
          file_type: file.type,
          teaching_center_id: req.teachingCenterId,
        });
        res.status(200).json({ success: true, data: uploadedFile });
      });
  } catch (error) {
    console.log(error);
    return res.status(500).json(error.message);
  }
};

const JSONUploadController = async (req, res) => {
  try {
    const file = req.file;
    const storageRef = ref(storage, `/locales/${file.originalname}`);
    await uploadBytes(storageRef, file.buffer)
      .then((snapshot) => {
        return getDownloadURL(ref(storage, snapshot.metadata.fullPath));
      })
      .then(async (url) => {
        const uploadedFile = await fileModel.create({
          url,
          filename: file.originalname,
          file_type: file.type,
          teaching_center_id: req.teachingCenterId,
        });
        res.status(200).json({ success: true, data: uploadedFile });
      });
  } catch (error) {
    console.log(error);
    return res.status(500).json(error.message);
  }
};

module.exports = {
  MultipleFileUploadController,
  SingleFileUploadController,
  JSONUploadController,
};
