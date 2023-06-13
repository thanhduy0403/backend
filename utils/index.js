const fs = require('fs');

// Add data to last of exist file or create new
const appendFile = (name = 'file.txt', content = '') => {
  fs.appendFile(name, content, function (err) {
    if (err) throw err;
    console.log('Success!');
  });
}

// Override exits file or create new
const writeFile = (name = 'file.txt', content = '') => {
  fs.writeFile(name, content, function (err) {
    if (err) throw err;
    console.log('Success!');
  });
}

const writeFileSync = (fileName, data) => {
  fs.writeFileSync(fileName, JSON.stringify(data), function (err) {
    if (err) {
      console.log('««««« err »»»»»', err);

      throw err
    };
    console.log('Saved!');
  });
}

const generationID = () => Math.floor(Date.now());

const validateSchema = (schema) => async (req, res, next) => {
  try {
    await schema.validate({
      body: req.body,
      query: req.query,
      params: req.params,
    }, { abortEarly: false });

    return next();
  } catch (err) {
    return res.status(400).json({
      errors: err?.errors,
      type: err.name,
      message: 'Xác thực dữ liệu thất bại',
    });
  }
};

module.exports = {
  generationID,
  writeFileSync,
  validateSchema,
}