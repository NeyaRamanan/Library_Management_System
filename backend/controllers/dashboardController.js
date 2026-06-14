const db = require("../config/db");

exports.getStats = (req, res) => {
  const stats = {};

  db.query("SELECT COUNT(*) AS totalBooks FROM books", (err, books) => {
    if (err) return res.status(500).json(err);

    stats.totalBooks = books[0].totalBooks;

    db.query("SELECT COUNT(*) AS totalUsers FROM users", (err, users) => {
      if (err) return res.status(500).json(err);

      stats.totalUsers = users[0].totalUsers;

      db.query(
        "SELECT COUNT(*) AS issuedBooks FROM issued_books WHERE status='issued'",
        (err, issued) => {
          if (err) return res.status(500).json(err);

          stats.issuedBooks = issued[0].issuedBooks;

          db.query(
            "SELECT COUNT(*) AS resources FROM digital_resources",
            (err, resources) => {
              if (err) return res.status(500).json(err);

              stats.resources = resources[0].resources;

              res.json(stats);
            }
          );
        }
      );
    });
  });
};