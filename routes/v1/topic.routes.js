const TopicRouter = require("express").Router();

const {
    CreateTopicController,
    UpdateTopicController,
    DeleteTopicController,
    GetTopicListByTeacherIdController, CreateSectionToTopic, GetTopicSectionsByTopicId, UpdateSectionInTopic,
    DeleteSectionInTopic, SortTopicSectionByTopicId,
} = require("../../controller/v1/topics.controller");
const {validateRequestBody} = require("../../middleware");
const {topicSchema, updateSection} = require("../../validation");

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
TopicRouter.post("/create-section/:topicId", CreateSectionToTopic);
TopicRouter.patch("/update-section/:section_id",
    validateRequestBody(updateSection),
    UpdateSectionInTopic);
TopicRouter.get("/get-section/:topicId", GetTopicSectionsByTopicId);
TopicRouter.delete("/delete-section/:section_id", DeleteSectionInTopic);
TopicRouter.patch('/sort-section/:topic_id',SortTopicSectionByTopicId)
module.exports = TopicRouter;
