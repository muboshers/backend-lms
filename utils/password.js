const bcrypt = require("bcrypt");

const generatePassword = async (password) => {
  try {
    const salt = await bcrypt.genSalt(12);
    return bcrypt.hash(password, salt);
  } catch (error) {
    console.log(error);
  }
};

const checkPassword = async (password, hashedPassword) => {
  try {
    return bcrypt.compare(password, hashedPassword);
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  generatePassword,
  checkPassword,
};
