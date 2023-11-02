const yup = require("yup");

const topicSchema = yup.object({
  body: yup.object({
    teacher_id: yup.string().required("O'quvtuvchini id si talab etiladi"),
    price: yup
      .number()
      .required("O'quvchining narhi talab etiladi xar bir o'quvchiga"),
  }),
});

module.exports = {
  topicSchema,
};
