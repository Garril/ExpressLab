module.exports = function buildResponse(code, data, msg) {
  return {
    code,
    data,
    msg
  }
}