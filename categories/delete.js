const { default: mongoose } = require('mongoose');
const { Category } = require('../models');

mongoose.connect('mongodb://127.0.0.1:27017/batch-29-30-database');

try {
  const id = '64678155915880e4b62e6f6b';

  Category.findByIdAndDelete(id).then((result) => {
    console.log(result);
  });
} catch (err) {
  console.log(err);
}