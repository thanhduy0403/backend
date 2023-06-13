const { default: mongoose } = require('mongoose');
const { Category } = require('../models');

mongoose.connect('mongodb://127.0.0.1:27017/batch-29-30-database');

try {
  const id = '6467827f6006d109e32b28aa';
  const data = { name: 'món ăn', description : 'cơm' };
  Category.findByIdAndUpdate(id, data, {
    new: true,
  }).then((result) => {
    console.log(result);
  });
} catch (err) {
  console.log(err);
}