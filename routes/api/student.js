const express = require("express");
const router = express.Router();

const stuServ = require("../../services/studentService");
// const buildResponse = require("../buildResponse");
const asyncHandler = require("../asyncHandler");

router.get("/", asyncHandler(
  async (req, res, next) => {
    const page = req.query.page || 1;
    const limit = req.query.limit || 10;
    const sex = req.query.sex || -1;
    const name = req.query.name || "";

    // const result = await stuServ.getStudents(page, limit, sex, name);
    // res.send(buildResponse(200, result, ''));
    return await stuServ.getStudents(page, limit, sex, name);
  }
));

router.get("/:id", asyncHandler(
  async (req, res, next) => {
    // const result = await stuServ.getStudentById(req.params.id)
    // res.send(buildResponse(200, result, ''));
    return await stuServ.getStudentById(req.params.id);
  }
));

router.post("/", asyncHandler(
  async (req, res, next) => {
    // const result = await stuServ.addStudent(req.body);
    // res.send(buildResponse(200, result, ''));
    return await stuServ.addStudent(req.body);
  }
));

router.delete("/:id", asyncHandler(
  async (req, res, next) => {
    return await stuServ.deleteStudent(req.params.id);
  }
))

router.put("/:id", asyncHandler(
  async (req, res, next) => {
    return await stuServ.updateStudent(req.params.id, req.body);
  }
))

module.exports = router;
