const { Product, Category, Supplier, Customer } = require("../../models");

module.exports = {
  question1: async (req, res, next) => {
    try {
      const conditionFind = {
        discount: { $lte: 5 },
      };
      let results = await Product.find(conditionFind);
      let total = await Product.countDocuments();

      return res.send({
        code: 200,
        total,
        totalResult: results.length,
        payload: results,
      });
    } catch (err) {
      return res.status(500).json({ code: 500, error: err });
    }
  },

  question1a: async (req, res, next) => {
    try {
      const { discount, type } = req.query;

      const conditionFind = {};

      if (discount) {
        switch (type) {
          case "eq":
            conditionFind.discount = { $eq: discount };
            break;

          case "lt":
            conditionFind.discount = { $lt: discount };
            break;

          case "lte":
            conditionFind.discount = { $lte: discount };
            break;

          case "gt":
            conditionFind.discount = { $gt: discount };
            break;

          case "gte":
            conditionFind.discount = { $gte: discount };
            break;

          default:
            conditionFind.discount = { $eq: discount };
            break;
        }
      }

      console.log("««««« conditionFind »»»»»", conditionFind);

      let results = await Product.find(conditionFind);
      let total = await Product.countDocuments();

      return res.send({
        code: 200,
        total,
        totalResult: results.length,
        payload: results,
      });
    } catch (err) {
      return res.status(500).json({ code: 500, error: err });
    }
  },

  question1b: async (req, res, next) => {
    try {
      const conditionFind = {
        discount: { $lte: 10 },
      };

      console.log("««««« conditionFind »»»»»", conditionFind);

      let results = await Product.find(conditionFind)
        .populate("supplier")
        .populate("category")
        .lean();

      let total = await Product.countDocuments();

      return res.send({
        code: 200,
        total,
        totalResult: results.length,
        payload: results,
      });
    } catch (err) {
      return res.status(500).json({ code: 500, error: err });
    }
  },

  question2a: async (req, res, next) => {
    try {
      const conditionFind = {
        stock: { $lte: 5 },
      };

      console.log("««««« conditionFind »»»»»", conditionFind);

      let results = await Product.find(conditionFind).lean();

      let total = await Product.countDocuments();

      return res.send({
        code: 200,
        total,
        totalResult: results.length,
        payload: results,
      });
    } catch (err) {
      return res.status(500).json({ code: 500, error: err });
    }
  },

  question2b: async (req, res, next) => {
    try {
      const conditionFind = {
        stock: { $lte: 5 },
      };

      console.log("««««« conditionFind »»»»»", conditionFind);

      let results = await Product.find(conditionFind)
        .populate("supplier")
        .populate("category")
        .lean();

      let total = await Product.countDocuments();

      return res.send({
        code: 200,
        total,
        totalResult: results.length,
        payload: results,
      });
    } catch (err) {
      return res.status(500).json({ code: 500, error: err });
    }
  },

  question3: async (req, res, next) => {
    try {
      // let discountedPrice = price * (100 - discount) / 100;
      const s = { $subtract: [100, "$discount"] }; // (100 - 10) s => 90

      // discount = 40 ~~~ { discount: { $eq: 40 } }

      const m = { $multiply: ["$price", s] }; // price * 90

      const d = { $divide: [m, 100] }; // price * 90 / 100

      // const { price } = req.query;

      const conditionFind = { $expr: { $lte: [d, parseFloat(1000)] } };

      console.log("««««« conditionFind »»»»»", conditionFind);

      let results = await Product.find(conditionFind).lean(); // convert data to object

      // const newResults = results.map((item) => {
      //   const dis = item.price * (100 - item.discount) / 100;
      //   return {
      //     ...item,
      //     dis,
      //   }
      // }).filter((item) => item.dis >= 40000);

      // console.log('««««« newResults »»»»»', newResults);

      let total = await Product.countDocuments();

      return res.send({
        code: 200,
        total,
        totalResult: results.length,
        payload: results,
      });
    } catch (err) {
      return res.status(500).json({ code: 500, error: err });
    }
  },

  question3a: async (req, res, next) => {
    try {
      const s = { $subtract: [100, "$discount"] }; // (100 - 10) s => 90

      const m = { $multiply: ["$price", s] }; // price * 90

      const d = { $divide: [m, 100] }; // price * 90 / 100

      const { price } = req.query;

      const conditionFind = { $expr: { $lte: [d, parseFloat(price)] } };

      console.log("««««« conditionFind »»»»»", conditionFind);

      let results = await Product.find(conditionFind).lean(); // convert data to object

      let total = await Product.countDocuments();

      return res.send({
        code: 200,
        total,
        totalResult: results.length,
        payload: results,
      });
    } catch (err) {
      return res.status(500).json({ code: 500, error: err });
    }
  },
  question3c: async (req, res, next) => {
    try {
      const s = { $subtract: [100, "$discount"] }; // (100 - 10) s => 90
      const m = { $multiply: ["$price", s] }; // price * 90
      const d = { $divide: [m, 100] }; // price * 90 / 100
      let results = await Product.aggregate()
        .addFields({ disPrice: d })
        .match({ $expr: { $lte: ["$disPrice", parseFloat(40000)] } })
        .project({
          categoryId: 0,
          supplierId: 0,
          description: 0,
        });

      let total = await Product.countDocuments();

      return res.send({
        code: 200,
        total,
        totalResult: results.length,
        payload: results,
      });
    } catch (err) {
      console.log("««««« err »»»»»", err);
      return res.status(500).json({ code: 500, error: err });
    }
  },

  question4: async (req, res, next) => {
    try {
      const { address, email } = req.query;
      const conditionFind = {
        email: new RegExp(`${email}`),
        address: { $regex: new RegExp(`${address}`), $options: "i" },
      };
      let results = await Customer.find(conditionFind);
      let total = await Customer.countDocuments();

      return res.send({
        code: 200,
        total,
        totalResult: results.length,
        payload: results,
      });
    } catch (err) {
      return res.status(500).json({ code: 500, error: err });
    }
  },

  question5: async (req, res, next) => {
    try {
      const { year } = req.query;
      const conditionFind = {
        $expr: {
          $eq: [{$year : '$birthday'},year],
        }
      }
    
      
      let results = await Customer.find(conditionFind);
      let total = await Customer.countDocuments();

      return res.send({
        code: 200,
        total,
        totalResult: results.length,
        payload: results,
      });
    } catch (err) {
      return res.status(500).json({ code: 500, error: err });
    }
  },

  question6: async (req, res, next) => {
    try {
      let results = await Customer.find();

      let total = await Customer.countDocuments();

      return res.send({
        code: 200,
        total,
        totalResult: results.length,
        payload: results,
      });
    } catch (err) {
      return res.status(500).json({ code: 500, error: err });
    }
  },
};
