const path = require("path");
const stuServ = require('../../services/studentService');

module.exports = {
  baseURL: "/api/template",
  config: [
    {
      method: "GET",
      needToken: false,
      path: "/",
      handler: async (req, res, next) => {
        const page = req.query.page || 1;
        const limit = req.query.limit || 10;
        const sex = req.query.sex || -1;
        const name = req.query.name || "";

        const result = await stuServ.getStudents(page, limit, sex, name);

        res.render("./template.ejs", {
          ...result,
          page, limit
        })
      }
    },
  ],
};
