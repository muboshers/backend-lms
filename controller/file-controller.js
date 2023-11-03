const { ref, getDownloadURL, uploadBytes } = require("firebase/storage");
const { storage } = require("../firebase.config");
const fileModel = require("../model/file.model");

const FileUploadController = async (req, res) => {
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

module.exports = {
  FileUploadController,
};
