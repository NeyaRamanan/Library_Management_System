const db = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.login = (req, res) => {
  const { email, password } = req.body;

  db.query(
    "SELECT * FROM users WHERE email = ?",
    [email],
    async (err, result) => {
      if (err) {
        return res.status(500).json(err);
      }

      if (result.length === 0) {
        return res.status(404).json({
          message: "User not found"
        });
      }

      const user = result[0];

      const isMatch = await bcrypt.compare(
        password,
        user.password
      );

      if (!isMatch) {
        return res.status(400).json({
          message: "Invalid password"
        });
      }

      const token = jwt.sign(
        {
          user_id: user.user_id,
          role: user.role
        },
        "library_secret",
        {
          expiresIn: "1d"
        }
      );

      res.json({
        token,
        role: user.role,
        name: user.name
      });
    }
  );
};