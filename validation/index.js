const { authSchema } = require("./auth.validation");
const {
  createTeachingCenterAdminSchema,
  updateTeachingCenterAdminSchema,
} = require("./teaching-center.validation");

module.exports = {
  createTeachingCenterAdminSchema,
  updateTeachingCenterAdminSchema,
  authSchema,
};
