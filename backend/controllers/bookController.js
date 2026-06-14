const db = require("../config/db");

// ====================
// GET ALL BOOKS
// ====================
exports.getBooks = (req, res) => {
  const sql = "SELECT * FROM books";

  db.query(sql, (err, result) => {
    if (err) {
      return res.status(500).json(err);
    }

    res.json(result);
  });
};

// ====================
// ADD BOOK
// ====================
exports.addBook = (req, res) => {
  const {
    title,
    author,
    isbn,
    category,
    quantity,
    available_quantity
  } = req.body;

  const sql = `
    INSERT INTO books
    (title, author, isbn, category, quantity, available_quantity)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [
      title,
      author,
      isbn,
      category,
      quantity,
      available_quantity
    ],
    (err, result) => {
      if (err) {
        return res.status(500).json(err);
      }

      res.json({
        message: "Book added successfully"
      });
    }
  );
};

// ====================
// DELETE BOOK
// ====================
exports.deleteBook = (req, res) => {
  const { id } = req.params;

  db.query(
    "DELETE FROM books WHERE book_id = ?",
    [id],
    (err, result) => {
      if (err) {
        return res.status(500).json(err);
      }

      res.json({
        message: "Book deleted successfully"
      });
    }
  );
};

// ====================
// UPDATE BOOK
// ====================
exports.updateBook = (req, res) => {
  const { id } = req.params;

  const {
    title,
    author,
    isbn,
    category,
    quantity,
    available_quantity
  } = req.body;

  const sql = `
    UPDATE books
    SET title=?,
        author=?,
        isbn=?,
        category=?,
        quantity=?,
        available_quantity=?
    WHERE book_id=?
  `;

  db.query(
    sql,
    [
      title,
      author,
      isbn,
      category,
      quantity,
      available_quantity,
      id
    ],
    (err, result) => {
      if (err) {
        return res.status(500).json(err);
      }

      res.json({
        message: "Book updated successfully"
      });
    }
  );
};

// ====================
// ISSUE BOOK
// ====================
exports.issueBook = (req, res) => {
  const {
    user_id,
    book_id,
    issue_date,
    due_date
  } = req.body;

  const issueSql = `
    INSERT INTO issued_books
    (user_id, book_id, issue_date, due_date, status)
    VALUES (?, ?, ?, ?, 'issued')
  `;

  db.query(
    issueSql,
    [user_id, book_id, issue_date, due_date],
    (err, result) => {
      if (err) {
        return res.status(500).json(err);
      }

      db.query(
        `
        UPDATE books
        SET available_quantity = available_quantity - 1
        WHERE book_id = ?
        `,
        [book_id],
        (err2) => {
          if (err2) {
            return res.status(500).json(err2);
          }

          res.json({
            message: "Book issued successfully"
          });
        }
      );
    }
  );
};

// ====================
// GET ISSUED BOOKS
// ====================
exports.getIssuedBooks = (req, res) => {
  const sql = `
    SELECT
      issue_id,
      issued_books.book_id,
      books.title,
      users.name,
      issue_date,
      due_date
    FROM issued_books
    JOIN books
      ON books.book_id = issued_books.book_id
    JOIN users
      ON users.user_id = issued_books.user_id
    WHERE status = 'issued'
  `;

  db.query(sql, (err, result) => {
    if (err) {
      return res.status(500).json(err);
    }

    res.json(result);
  });
};

// ====================
// RETURN BOOK
// ====================
exports.returnBook = (req, res) => {
  const { issue_id, book_id } = req.body;

  const updateIssueSql = `
    UPDATE issued_books
    SET
      status = 'returned',
      return_date = CURDATE()
    WHERE issue_id = ?
  `;

  db.query(updateIssueSql, [issue_id], (err) => {
    if (err) {
      return res.status(500).json(err);
    }

    const updateBookSql = `
      UPDATE books
      SET available_quantity = available_quantity + 1
      WHERE book_id = ?
    `;

    db.query(updateBookSql, [book_id], (err2) => {
      if (err2) {
        return res.status(500).json(err2);
      }

      res.json({
        message: "Book returned successfully"
      });
    });
  });
};

exports.getIssuedBooks = (req, res) => {
  const sql = `
    SELECT
      ib.issue_id,
      u.name AS user_name,
      b.title AS book_title,
      ib.issue_date,
      ib.due_date,
      ib.return_date,
      ib.status
    FROM issued_books ib
    JOIN users u
      ON ib.user_id = u.user_id
    JOIN books b
      ON ib.book_id = b.book_id
    ORDER BY ib.issue_id DESC
  `;

  db.query(sql, (err, result) => {
    if (err) {
      return res.status(500).json(err);
    }

    res.json(result);
  });
};