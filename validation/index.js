const { authSchema } = require("./auth.validation");
const {
  createTeachingCenterSchema,
  updateTeachingCenterAdminSchema,
} = require("./teaching-center.validation");

module.exports = {
  createTeachingCenterSchema,
  updateTeachingCenterAdminSchema,
  authSchema,
};
