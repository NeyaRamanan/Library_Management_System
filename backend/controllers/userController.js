const db = require("../config/db");
const bcrypt = require("bcryptjs");

exports.getUsers = (req, res) => {
  db.query(
    "SELECT user_id, name, email, role FROM users",
    (err, result) => {
      if (err) {
        return res.status(500).json(err);
      }

      res.json(result);
    }
  );
};

exports.addUser = async (req, res) => {
  const {
    name,
    email,
    password,
    role
  } = req.body;

  try {
    const hashedPassword =
      await bcrypt.hash(password, 10);

    const sql = `
      INSERT INTO users
      (name, email, password, role)
      VALUES (?, ?, ?, ?)
    `;

    db.query(
      sql,
      [name, email, hashedPassword, role],
      (err, result) => {
        if (err) {
          return res.status(500).json(err);
        }

        res.json({
          message: "User added successfully"
        });
      }
    );
  } catch (error) {
    res.status(500).json(error);
  }
};

exports.deleteUser = (req, res) => {
  const { id } = req.params;

  db.query(
    "DELETE FROM users WHERE user_id = ?",
    [id],
    (err, result) => {
      if (err) {
        return res.status(500).json(err);
      }

      res.json({
        message: "User deleted successfully"
      });
    }
  );
};

exports.updateUser = async (req, res) => {
  const { id } = req.params;

  const {
    name,
    email,
    password,
    role
  } = req.body;

  try {
    const hashedPassword =
      await bcrypt.hash(password, 10);

    db.query(
      `
      UPDATE users
      SET name=?,
          email=?,
          password=?,
          role=?
      WHERE user_id=?
      `,
      [
        name,
        email,
        hashedPassword,
        role,
        id
      ],
      (err, result) => {
        if (err) {
          return res.status(500).json(err);
        }

        res.json({
          message: "User updated successfully"
        });
      }
    );
  } catch (error) {
    res.status(500).json(error);
  }
};