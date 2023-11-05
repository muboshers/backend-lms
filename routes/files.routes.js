const FilesRouter = require("express").Router();

const {
  MultipleFileUploadController,
  SingleFileUploadController,
} = require("../controller/file-controller");

const { upload } = require("../firebase.config");

FilesRouter.post(
  "/upload",
  upload.array("image"),
  MultipleFileUploadController
);

FilesRouter.post(
  "/single-upload",
  upload.single("image"),
  SingleFileUploadController
);

module.exports = FilesRouter;
