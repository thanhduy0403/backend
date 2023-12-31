const { Employee } = require("../../models");
const {generateToken,generateRefreshToken} = require("../../helpers/jwtHelper");

module.exports = {

  login:async(req,res,next)=>{
    console.log('« req.user »', req.user);
    try {
      const {email} = req.body;
      const getEmployee = await Employee.findOne({email}).select('-password').lean();
      const token= generateToken(getEmployee);
      const  resettoken = generateRefreshToken(getEmployee._id)
      return res.status(200).json({
        token,
        resettoken,
      })
    } catch (error) {
      res.status(400).json({
        message :'loi',
        statuscode :400,
      })
    }
  },


  getMe: async (req, res, next) => {
    try {
      res.status(200).json({
        payload: req.user,
      });
    } catch (err) {
      res.sendStatus(500);
    }
  },

  getAll: async (req, res, next) => {
    try {
      let results = await Employee.find().select('-password');

      return res.send({ code: 200, payload: results });
    } catch (err) {
      return res.status(500).json({ code: 500, error: err });
    }
  },

  getDetail: async (req, res, next) => {
    try {
      const { id } = req.params;

      let found = await Employee.findById(id);

      if (found) {
        return res.send({ code: 200, payload: found });
      }

      return res.status(410).send({ code: 404, message: "Không tìm thấy" });
    } catch (err) {
      res.status(404).json({
        message: "Get detail fail!!",
        payload: err,
      });
    }
  },

  create: async function (req, res, next) {
    try {
      const data = req.body;

      const { email, phoneNumber, address } = data;

      const getEmailExits = Employee.find({ email });
      const getPhoneExits = Employee.find({ phoneNumber });
      const getAddressExits = Employee.find({ address });

      const [foundEmail, foundPhoneNumber, foundAddress] = await Promise.all([
        getEmailExits,
        getPhoneExits,
        getAddressExits,
      ]);

      const errors = [];
      if (foundEmail && foundEmail.length > 0) errors.push("Email đã tồn tại");
      // if (!isEmpty(foundEmail)) errors.push('Email đã tồn tại');
      if (foundPhoneNumber && foundPhoneNumber.length > 0)
        errors.push("Số điện thoại đã tồn tại");
      if (foundAddress && foundAddress.length > 0)
        errors.push("Địa chỉ đã tồn tại");

      if (errors.length > 0) {
        return res.status(404).json({
          code: 404,
          message: "Không thành công",
          errors,
        });
      }

      const newItem = new Employee(data);

      let result = await newItem.save();

      return res.send({
        code: 200,
        message: "Tạo thành công",
        payload: result,
      });
    } catch (err) {
      console.log("««««« err »»»»»", err);
      return res.status(500).json({ code: 500, error: err });
    }
  },

  remove: async function (req, res, next) {
    try {
      const { id } = req.params;

      let found = await Employee.findByIdAndDelete(id);

      if (found) {
        return res.send({
          code: 200,
          payload: found,
          message: "Xóa thành công",
        });
      }

      return res.status(410).send({ code: 404, message: "Không tìm thấy" });
    } catch (err) {
      return res.status(500).json({ code: 500, error: err });
    }
  },

  update: async function (req, res, next) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const { email, phoneNumber, address } = updateData;

      const getEmailExits = Employee.find({ email });
      const getPhoneExits = Employee.find({ phoneNumber });
      const getAddressExits = Employee.find({ address });

      const [foundEmail, foundPhoneNumber, foundAddress] = await Promise.all([
        getEmailExits,
        getPhoneExits,
        getAddressExits,
      ]);

      const errors = [];
      if (foundEmail && foundEmail.length > 0) errors.push("Email đã tồn tại");
      // if (!isEmpty(foundEmail)) errors.push('Email đã tồn tại');
      if (foundPhoneNumber && foundPhoneNumber.length > 0)
        errors.push("Số điện thoại đã tồn tại");
      if (foundAddress && foundAddress.length > 0)
        errors.push("Địa chỉ đã tồn tại");

      if (errors.length > 0) {
        return res.status(404).json({
          code: 404,
          message: "Không thành công",
          errors,
        });
      }

      const found = await Employee.findByIdAndUpdate(id, updateData, {
        new: true,
      });

      if (found) {
        return res.send({
          code: 200,
          message: "Cập nhật thành công",
          payload: found,
        });
      }

      return res.status(404).send({ code: 404, message: "Không tìm thấy" });
    } catch (error) {
      return res.status(500).json({ code: 500, error: err });
    }
  },
};
