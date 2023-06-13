var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const cors = require("cors");
const passport = require("passport");

require("dotenv").config();

const {
  passportConfig,
  passportConfigLocal,
} = require("./middlewares/passport");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");

var suppliersRouter = require("./routes/suppliers");
var productsRouter = require("./routes/products");
var ordersRouter = require("./routes/orders");
var employeesRouter = require("./routes/employee/router");
var categoryRouter = require("./routes/category/router");
var mediaRouter = require("./routes/media/router");
var questionRouter = require("./routes/question/router");
var customerRouter = require("./routes/customer/router");

// var addproductRouter = require('./routes/addproduct');

const { mongo } = require("mongoose");
const { default: mongoose } = require("mongoose");
const { DATABASE } = require("./constants/dbSetting");
var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

passport.use(passportConfig);
passport.use(passportConfigLocal);

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use(
  cors({
    origin: "*",
  })
);

mongoose.set("strictQuery", false);
mongoose.connect(DATABASE);

app.use("/", indexRouter);
app.use("/users", usersRouter);

app.use("/suppliers", suppliersRouter);
app.use("/products", productsRouter);
app.use("/orders", ordersRouter);
app.use("/employees", employeesRouter);
app.use("/media", mediaRouter);
app.use("/category", categoryRouter);
app.use("/customer", customerRouter);
app.use("/questions", questionRouter);
// app.use('/addproduct', addproductRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
