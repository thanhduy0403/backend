const yup = require("yup");
const ObjectId = require("mongodb").ObjectId;

const validateSchema = (schema) => async (req, res, next) => {
  try {
    await schema.validate({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    return next();
  } catch (err) {
    return res.status(400).json({ type: err.name, message: err.message });
  }
};

const getProductsSchema = yup.object({
  query: yup.object({
    category: yup
      .string()
      .test("Validate ObjectID", "${path} is not valid ObjectID", (value) => {
        if (!value) return true;
        return ObjectId.isValid(value);
      }),
    sup: yup
      .string()
      .test("Validate ObjectID", "${path} is not valid ObjectID", (value) => {
        if (!value) return true;
        return ObjectId.isValid(value);
      }),
  }),
});

const createroductsSchema = yup.object({
  body: yup.object({
    name: yup
      .string()
      .required()
      .max(50, "Tên sản phẩm không được vượt quá 50 ký tự"),
    price: yup.number().required().min(0),
    description: yup.string().max(500, "Mô tả không được vượt quá 500 ký tự"),
    stock: yup.number().min(0),
    discount: yup.number().max(75).min(0),
    categoryId: yup
      .string()
      .test("Validate ObjectID", "${path} is not valid ObjectID", (value) => {
        if (!value) return true;
        return ObjectId.isValid(value);
      }),
    supplierId: yup
      .string()
      .test("Validate ObjectID", "${path} is not valid ObjectID", (value) => {
        if (!value) return true;
        return ObjectId.isValid(value);
      }),
  }),
});

module.exports = {
  validateSchema,
  getProductsSchema,
  createroductsSchema,
};
