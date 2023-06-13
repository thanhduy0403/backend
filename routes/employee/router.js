const express = require("express");
const passport = require("passport");

const router = express.Router();

const { validateSchema } = require("../../utils");
const { getDetailSchema, createSchema, loginSchema,editSchema } = require("./validations");
const {
  login,
  getAll,
  getDetail,
  create,
  remove,
  update,
  getMe,
} = require("./controller");
const allowRoles = require("../../middlewares/checkRole");
router
  .route("/login")
  .post(
    validateSchema(loginSchema),
    passport.authenticate("local", { session: false }),
    login,
  );

router.route("/").get(getAll).post(validateSchema(createSchema), create);

router
  .route("/profile") // Đối tượng cần kiểm tra là token có hợp lệ hay không
  .get(passport.authenticate("jwt", { session: false }), getMe);

router
  .route("/")
  .get(
    passport.authenticate("jwt", { session: false }),
    allowRoles("GET_ALL_EMPLOYEEEEEE"),
    getAll
  )
  .post(validateSchema(createSchema), create);

  router.route('/:id')
  .get(validateSchema(getDetailSchema), passport.authenticate('jwt', { session: false }), getDetail)
  .patch(validateSchema(editSchema), passport.authenticate('jwt', { session: false }), update)
  .delete(
    passport.authenticate('jwt', { session: false }), // CHECK TOKEN IS VALID
    allowRoles('DELETE_EMPLOYEE'), // CHECK USER HAS ROLE
    validateSchema(getDetailSchema), // CHECK PARAMS
    remove, // HANDLE DELETE
  )

module.exports = router;
