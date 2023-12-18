const yup = require("yup");

const topicSchema = yup.object({
    body: yup.object({
        teacher_id: yup.string().required("O'quvtuvchini id si talab etiladi"),
        price: yup
            .number()
            .required("O'quvchining narhi talab etiladi xar bir o'quvchiga"),
        percentage: yup.number().max(100, "Umumiy foiz 100% dan oshmasligi kerak"),
        week_days: yup.array().required(),
        start_date: yup.string().required(),
        during_month: yup.number().required(),
        time_of_day: yup.string().required(),
    }),
});

const updateSection = yup.object({
    body: yup.object({
        name: yup.string().required("Bo'lim nomi talab etiladi"),
    }),
});

module.exports = {
    topicSchema,
    updateSection
};
