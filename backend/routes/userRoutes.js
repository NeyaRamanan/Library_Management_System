const express = require("express");
const router = express.Router();

const {
  getUsers,
  addUser,
  deleteUser,
  updateUser
} = require("../controllers/userController");

router.get("/", getUsers);

router.post("/", addUser);

router.delete("/:id", deleteUser);

router.put("/:id", updateUser);

module.exports = router;