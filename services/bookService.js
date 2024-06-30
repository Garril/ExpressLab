const Book = require('../models/entity/Book');

exports.addBook = async function (bookArr, operatorId) {
  // 操作权限
  if (operatorId) { }
  const ins = await Book.bulkCreate(bookArr);
  return ins;
}
