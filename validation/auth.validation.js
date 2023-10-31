const yup = require("yup");

const authSchema = yup.object({
  body: yup.object({
    login: yup.string().required("Kirish logini talab etiladi!"),
    password: yup.string().required("Kirish paroli talab etiladi"),
    is_teacher: yup
      .boolean()
      .required("Siz o'qituvchimisiz ishorasi talab etiladi"),
  }),
});

module.exports = {
  authSchema,
};
