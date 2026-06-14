const db = require("../config/db");

exports.getResources = (req, res) => {
  db.query(
    "SELECT * FROM digital_resources",
    (err, result) => {
      if (err) {
        return res.status(500).json(err);
      }

      res.json(result);
    }
  );
};

exports.addResource = (req, res) => {
  const {
    title,
    category,
    file_url
  } = req.body;

  db.query(
    `INSERT INTO digital_resources
     (title, category, file_url)
     VALUES (?, ?, ?)`,
    [title, category, file_url],
    (err, result) => {
      if (err) {
        return res.status(500).json(err);
      }

      res.json({
        message: "Resource added successfully"
      });
    }
  );
};