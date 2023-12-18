const { authSchema } = require("./auth.validation");
const { groupSchema } = require("./group.validation");
const {
  createTeachingCenterAdminSchema,
  updateTeachingCenterAdminSchema,
  updateTeachingCenterSchema,
} = require("./teaching-center.validation");
const { topicSchema,updateSection } = require("./topic.validation");

module.exports = {
  createTeachingCenterAdminSchema,
  updateTeachingCenterAdminSchema,
  authSchema,
  groupSchema,
  topicSchema,
  updateTeachingCenterSchema,
  updateSection
};
