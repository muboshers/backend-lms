const TopicRouter = require("express").Router();

const {
  CreateTopicController,
  UpdateTopicController,
  DeleteTopicController,
  GetTopicListByTeacherIdController,
} = require("../controller/topics.controller");
const { validateRequestBody } = require("../middleware");
const { topicSchema } = require("../validation");

TopicRouter.post(
  "/create",
  validateRequestBody(topicSchema),
  CreateTopicController
);
TopicRouter.patch("/update/:id", UpdateTopicController);
TopicRouter.delete("/delete/:id", DeleteTopicController);
TopicRouter.get(
  "/get-by-teacher/:teacher_id",
  GetTopicListByTeacherIdController
);

module.exports = TopicRouter;
