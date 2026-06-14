const express = require("express");
const router = express.Router();

const {
  getResources,
  addResource
} = require("../controllers/resourceController");

router.get("/", getResources);

router.post("/", addResource);

module.exports = router;