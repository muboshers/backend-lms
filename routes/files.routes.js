const FilesRouter = require("express").Router();

const { FileUploadController } = require("../controller/file-controller");

const { upload } = require("../firebase.config");

FilesRouter.post("/upload", upload.array("image"), FileUploadController);

module.exports = FilesRouter;
