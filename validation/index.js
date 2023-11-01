const { authSchema } = require("./auth.validation");
const { groupCreateSchema } = require("./group.validation");
const {
  createTeachingCenterAdminSchema,
  updateTeachingCenterAdminSchema,
} = require("./teaching-center.validation");

module.exports = {
  createTeachingCenterAdminSchema,
  updateTeachingCenterAdminSchema,
  authSchema,
  groupCreateSchema,
};
