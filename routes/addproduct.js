var express = require("express");
var router = express.Router();
const { generationID, writeFileSync } = require("../utils");
const yup = require("yup");
//let products = require("../data/products.json");

//get
// router.get('/:id', function(req, res, next) {
//   const id =req.params.id
//   const validationSchema = yup.object().shape({
//     id: yup.number()
//   });
//   validationSchema
//   .validate(req.params)
//   .then(() => {
//     console.log('Validation passed');

//      const product = products.find((p)=>p.id.toString()=== id.toString())

//     if (!product) {
//       res.status(404).json({
//         code: 4041,
//         message: 'Get detail fail!!',
//       });
//     }

//     res.status(200).json({
//       code: 2001,
//       message: 'Get detail success!!',
//       payload: product,
//     });
//   })
//   .catch((err) => {
//     res.status(404).json({
//       message: 'Get detail fail!!',
//       payload: err,
//     });
//   });
// });
//post
router.post("/", function (req, res, next) {
  const { name, mess, phone } = req.body;
  const phoneRegExp = /(84|0[3|5|7|8|9])+([0-9]{8})\b/;
  const validationSchema = yup.object().shape({
    body: yup.object({
      name: yup.string().max(50).required("name ko duoc bo trong"),
      phone: yup
        .string()
        .matches(phoneRegExp, "kiem tra lai so dien thoai")
        .required("Số dt không được bỏ trống"),
      mess: yup.string().required("khong dc bo trong"),
    }),
  });

  validationSchema
    .validate({ body: req.body }, { abortEarly: false })
    .then(() => {
      console.log("Validation passed");
      const newProduct = {
        id: generationID(),
        name,
        mess,
        phone,
      };

      products.push(newProduct);
      writeFileSync("./data/products.json", products);

      res.status(201).json({
        code: 2011,
        message: "them san pham thanh cong",
        payload: products,
      });
    })
    .catch((err) => {
      return res.status(400).json({
        message: "them san pham that bai",
        type: err.name,
        errors: err.errors,
        provider: "yup",
      });
    });
});

router.get("/", function (req, res, next) {
  res.status(200).json({
    message: "thanhcong",
    total: products.length,
    code: 201,
    payload: products,
  });
});
// patch
router.patch("/:id", function (req, res, next) {
  const { id } = req.params;

  const checkProductExits = products.find(
    (p) => p.id.toString() === id.toString()
  );

  if (!checkProductExits) {
    res.status(404).json({
      code: 4041,
      message: "Not found",
    });
  }

  const productUpdate = {
    ...checkProductExits,
    ...req.body,
  };

  const newProductList = products.map((p) => {
    if (p.id.toString() === id.toString()) {
      return productUpdate;
    }

    return p;
  });

  writeFileSync("./data/products.json", newProductList);

  res.status(201).json({
    code: 200,
    message: "Update success!!",
    payload: productUpdate,
  });
});
// delete
router.delete("/:id", function (req, res, next) {
  const validationSchema = yup.object().shape({
    params: yup.object({
      id: yup.number().test("validationID", "ID sai định dạng", (val) => {
        return val.toString().length === 13;
      }),
    }),
  });

  validationSchema
    .validate({ params: req.params }, { abortEarly: false })
    .then(() => {
      console.log("Validation passed");
      const { id } = req.params;

      const newProductList = products.filter(
        (p) => p.id.toString() !== id.toString()
      );

      products = newProductList;

      writeFileSync("./data/products.json", newProductList);

      res.status(201).json({
        code: 200,
        message: "xoa san pham thanh cong!!",
      });
    })
    .catch((err) => {
      res.status(404).json({
        payload: err,
      });
    });
});

module.exports = router;
