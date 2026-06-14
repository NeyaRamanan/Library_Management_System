const db = require("../config/db");

exports.getHistory = (req, res) => {
  db.query(
    "SELECT * FROM issued_books ORDER BY issue_id DESC",
    (err, result) => {
      if (err) {
        return res.status(500).json(err);
      }

      res.json(result);
    }
  );
};