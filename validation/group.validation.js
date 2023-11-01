const yup = require("yup");

const groupCreateSchema = yup.object({
  body: yup.object({
    name: yup.string().required("Guruh nomi talab etiladi!"),
    image: yup.string().required("Rasm talab etiladi!"),
  }),
});

module.exports = {
  groupCreateSchema,
};
