const ApiError = require('../utils/ApiError');
exports.nullChecker = (field) => {
  if (field === undefined || field === null) {
    return true;
  }
  return false;
}