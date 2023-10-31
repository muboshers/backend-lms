const yup = require("yup");

const createTeachingCenterAdminSchema = yup.object({
  body: yup.object({
    name: yup.string().required("O'quv markaz ismi talab etiladi"),
    phone_number: yup
      .string()
      .required("O'quv markazning telefon raqami talab etiladi"),
    password: yup
      .string()
      .min(6, "Parol 6 yoki undan ko'p belgidan iborat bo'lishi kerak")
      .required("O'quv markaz uchun parol talab etiladi"),
    login: yup.string().required("O'quv markaz uchun login talab etiladi"),
    address: yup.string().required("O'quv markazning manzili talab etiladi"),
    location: yup
      .string()
      .required("O'quv markazning joylashuvi talab etiladi"),
  }),
});

const updateTeachingCenterAdminSchema = yup.object({
  params: yup.object({
    id: yup.string().required("O'quv markaz idsi talab etiladi"),
  }),
});

module.exports = {
  createTeachingCenterAdminSchema,
  updateTeachingCenterAdminSchema,
};
