const express = require("express");
const router = express.Router();

const {
  getBooks,
  addBook,
  deleteBook,
  updateBook,
  issueBook,
  returnBook,
  getIssuedBooks
} = require("../controllers/bookController");

// ====================
// BOOK CRUD
// ====================
router.get("/", getBooks);

router.post("/", addBook);

router.put("/:id", updateBook);

router.delete("/:id", deleteBook);

// ====================
// ISSUE BOOK
// ====================
router.post("/issue", issueBook);

// ====================
// VIEW ISSUED BOOKS
// ====================
router.get("/issued", getIssuedBooks);

// ====================
// RETURN BOOK
// ====================
router.post("/return", returnBook);

router.get("/history", getIssuedBooks);

module.exports = router;