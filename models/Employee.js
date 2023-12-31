const mongoose = require("mongoose");
const { Schema, model } = mongoose;
const bcrypt = require("bcrypt");

// Mongoose Datatypes:
// https://mongoosejs.com/docs/schematypes.html

// Validator
// https://mongoosejs.com/docs/validation.html#built-in-validators

const employeeSchema = new Schema(
  {
    firstName: {
      type: String,
      required: [true, "ten khong duoc bo trong"],
      maxLenght: [50, "ten khong duoc qua 50 ky tu"],
    },
    lastName: {
      type: String,
      required: [true, "ho khong duoc bo trong"],
      maxLenght: [50, "ho khong duoc qua 50 ky tu"],
    },
    email: {
      type: String,
      require: [true, "yeu cau nhap dung dinh dang email"],
      validate: {
        validator: function (value) {
          const emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
          return emailRegex.test(value);
        },
        message: `{VALUE} is not a valid email!`,
        // message: (props) => `{props.value} is not a valid email!`,
      },
      required: [true, "Email không được bỏ trống"],
      maxLength: [50, "Email không được vượt quá 50 ký tự"],
      unique: [true, "Email không được trùng"],
    },
    phoneNumber: {
      maxLenght: [50, "so dien thoai khong duoc qua 50 ky tu"],
      type: String,
      validate: {
        validator: function (value) {
          const phoneRegex =
            /^(0?)(3[2-9]|5[6|8|9]|7[0|6-9]|8[0-6|8|9]|9[0-4|6-9])[0-9]{7}$/;
          return phoneRegex.test(value);
        },
        message: `{VALUE} is not a valid phone!`,
        // message: (props) => `{props.value} is not a valid email!`,
      },
    },
    password: {
      type: String,
      required: [true, "Mật khẩu không được bỏ trống"],
      minLenght: [6, "Mật khẩu phải có tối thiểu 6 kí tự"],
      maxLenght: [12, "Mật khẩu không được vượt quá 12 ký tự"],
    },
    address: {
      type: String,
      required: [true, "yeu cau nhap dia chi"],
      maxlength: [500, "Địa chỉ không được vượt quá 500 ký tự"],
      unique: [true, "Địa chỉ không được trùng"],
    },
    birthday: { type: Date, require: [true, "yeu cau nhap ngay sinh"] },

    roles: {
      type: Array,
      default: [],
    },
  },
  {
    versionKey: false,
  }
);

// Virtuals
employeeSchema.virtual("fullName").get(function () {
  return this.firstName + " " + this.lastName;
});

employeeSchema.pre("save", async function (next) {
  try {
    // generate salt key
    const salt = await bcrypt.genSalt(10); // 10 ký tự
    // generate password = salt key + hash key
    const hashPass = await bcrypt.hash(this.password, salt);
    // override password
    this.password = hashPass;
    next();
  } catch (err) {
    next(err);
  }
});

employeeSchema.methods.isValidPass = async function (pass) {
  try {
    return await bcrypt.compare(pass, this.password);
  } catch (err) {
    throw new Error(err);
  }
};

// employeeSchema.pre('save', function a(next) {
//   const user = this;

//   if (!user.isModified('password')) return next();

//   bcrypt.genSalt(10, (err, salt) => {
//     if (err) return next(err);

//     bcrypt.hash(user.password, salt, (hashErr, hash) => {
//       if (hashErr) return next(hashErr);

//       user.password = hash;
//       next();
//     });
//   });
// });

const Employee = model("Employee", employeeSchema);
module.exports = Employee;
