import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import db from "../config/db.js";
dotenv.config();
const SECRET_KEY = process.env.JWT_SECRET || "Catify_secret_key";

const authRoutes = express.Router();



authRoutes.post("/register", async (req, res) => {
  try {
    // Данные пользователя с клиента
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    // Запрос в БД
    const sql = `INSERT INTO users (username, email, password) VALUES (?, ?, ?)`;
    db.run(sql, [username, email, hashedPassword], function (err) {
      if (err) {
        // проверка уникальности почты для регистрации
        if (err.message.includes("UNIQUE constraint failed")) {
          return res
            .status(400)
            .json({ message: "User with this email already exists" });
        }
        return res.status(500).json({ message: "Database error" });
      }

      res.sendStatus(200);
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Registration failed", error: error.message });
  }
});



authRoutes.post("/login", async (req, res) => {
  try {
    // Данные пользователя с клиента
    const { email, password } = req.body;

    // Запрос в БД
    const sql = `SELECT * FROM users WHERE email = ?`;
    db.get(sql, [email], async (err, user) => {
      // Ошибка БД или нет пользователя
      if (err) return res.status(500).json({ message: "Database error" });
      if (!user) return res.status(404).json({ message: "User not found" });

      // Сравниваем введенный пароль с хешем в базе
      const isValidPass = await bcrypt.compare(password, user.password);

      if (!isValidPass) {
        return res.status(400).json({ message: "Invalid login or password" });
      }

      // Создаем JWT токен
      const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, {
        expiresIn: "30d",
      });

      // Возвращаем данные
      res.json({
        message: "Success",
        user: { id: user.id, username: user.username, email: user.email },
        token,
      });
    });
  } catch (error) {
    res.status(500).json({ message: "Login failed" });
  }
});

export default authRoutes;
