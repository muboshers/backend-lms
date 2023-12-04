const yup = require("yup");

const groupSchema = yup.object({
  body: yup.object({
    name: yup.string().required("Guruh nomi talab etiladi!"),
    topics: yup.array().of(
      yup.object().shape({
        price: yup.number(),
        percentage: yup.number().max(100),
        week_days: yup.array(),
        start_date: yup.string(),
        during_month: yup.number(),
        time_of_day: yup.string(),
      })
    ),
  }),
});

module.exports = {
  groupSchema,
};
