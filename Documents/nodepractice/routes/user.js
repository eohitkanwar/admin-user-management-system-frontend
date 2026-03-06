const express = require("express");
const {
  createUser,
  loginUser,
  getUser,
  updateUser,
  verifyToken,
  findUser,
  getData,
  emailSend
} = require("../controllers/user");
const userValidation = require("../validation/user");
const router = express.Router();

router.post("/createUser", userValidation, createUser);

router.get("/loginUser", loginUser);

router.get("/getUser", getUser);

router.put("/updateUser", updateUser);

router.get("/verifyToken", verifyToken)

router.get("/findUser/:name/:age",findUser)

router.get("/getData",getData)


module.exports = router;
