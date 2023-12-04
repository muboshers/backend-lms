const { authSchema } = require("./auth.validation");
const { groupSchema } = require("./group.validation");
const {
  createTeachingCenterAdminSchema,
  updateTeachingCenterAdminSchema,
} = require("./teaching-center.validation");
const { topicSchema } = require("./topic.validation");

module.exports = {
  createTeachingCenterAdminSchema,
  updateTeachingCenterAdminSchema,
  authSchema,
  groupSchema,
  topicSchema,
};
