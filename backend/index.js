import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cors from "cors";
import dotenv from "dotenv";
import db from "./db.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

const SECRET_KEY = process.env.JWT_SECRET || "Catify_secret_key";

app.post("/auth/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // 1. Хешируем пароль (соль = 10)
    const hashedPassword = await bcrypt.hash(password, 10);

    // 2. Сохраняем в базу данных
    const sql = `INSERT INTO users (username, email, password) VALUES (?, ?, ?)`;

    db.run(sql, [username, email, hashedPassword], function (err) {
      if (err) {
        if (err.message.includes("UNIQUE constraint failed")) {
          return res
            .status(400)
            .json({ message: "User with this email already exists" });
        }
        return res.status(500).json({ message: "Database error" });
      }

      // 3. Создаем JWT токен
      const userId = this.lastID;
      const token = jwt.sign(
        { id: userId, email },
        SECRET_KEY,
        { expiresIn: "30d" }, // Токен живет 30 дней
      );

      // 4. Возвращаем ответ
      res.status(201).json({
        message: "Success",
        user: { id: userId, username, email },
        token,
      });
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Registration failed", error: error.message });
  }
});

app.post("/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Ищем пользователя в базе
    const sql = `SELECT * FROM users WHERE email = ?`;

    db.get(sql, [email], async (err, user) => {
      if (err) return res.status(500).json({ message: "Database error" });
      if (!user) return res.status(404).json({ message: "User not found" });

      // 2. Сравниваем введенный пароль с хешем в базе
      const isValidPass = await bcrypt.compare(password, user.password);

      if (!isValidPass) {
        return res.status(400).json({ message: "Invalid login or password" });
      }

      // 3. Создаем JWT токен
      const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, {
        expiresIn: "30d",
      });

      // 4. Возвращаем данные
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

import axios from "axios";

app.get("/songs/:id", async (req, res) => {
  const trackId = req.params.id;
  try {
    // Здесь логика получения свежей ссылки (например, fetch из Deezer API)
    const response = await fetch(`https://api.deezer.com/track/${trackId}`);
    const data = await response.json();

    // Возвращаем объект с url
    res.json({
      id: data.id,
      url: data.preview, // или другое поле со ссылкой на mp3
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to get fresh link" });
  }
});

app.get("/songs", async (req, res) => {
  try {
    const query = req.query.search || "Phonk"; // Поиск по умолчанию
    const response = await axios.get(
      `https://api.deezer.com/search?q=${query}`,
    );

    // Преобразуем данные из Deezer в твой формат
    const songs = response.data.data.map((track) => ({
      id: track.id,
      title: track.title,
      artist: track.artist.name,
      duration: track.duration, // Длительность в секундах
      image: track.album.cover_big, // Ссылка на фото
    }));

    res.json(songs);
  } catch (error) {
    res.status(500).json({ message: "Error fetching songs" });
  }
});

// Роут для добавления/удаления лайка
app.post("/favorites/toggle", async (req, res) => {
  const { userId, track } = req.body; // track - это весь объект песни

  // Проверяем, есть ли уже лайк
  db.get(
    "SELECT * FROM favorites WHERE userId = ? AND trackId = ?",
    [userId, track.id],
    (err, row) => {
      if (row) {
        // Если есть - удаляем
        db.run("DELETE FROM favorites WHERE userId = ? AND trackId = ?", [
          userId,
          track.id,
        ]);
        return res.json({ isLiked: false });
      } else {
        // Если нет - добавляем
        const sql = `INSERT INTO favorites (userId, trackId, title, artist, duration, image) VALUES (?,?,?,?,?,?)`;
        db.run(sql, [
          userId,
          track.id,
          track.title,
          track.artist,
          track.duration,
          track.image,
        ]);
        return res.json({ isLiked: true });
      }
    },
  );
});

// Роут для получения списка любимых треков пользователя
app.get("/favorites/:userId", (req, res) => {
  const sql = `
    SELECT 
      trackId AS id, 
      title, 
      artist, 
      duration, 
      image
    FROM favorites 
    WHERE userId = ?
  `;

  db.all(sql, [req.params.userId], (err, rows) => {
    if (err) return res.status(500).json(err);
    res.json(rows);
  });
});

app.get("/favorites-ids/:userId", (req, res) => {
  db.all(
    "SELECT trackId FROM favorites WHERE userId = ?",
    [req.params.userId],
    (err, rows) => {
      if (err) return res.status(500).json(err);
      // Превращаем [{trackId: 1}, {trackId: 2}] в [1, 2]
      const ids = rows.map((row) => row.trackId);
      res.json(ids);
    },
  );
});

const authenticateToken = (req, res) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.sendStatus(401); // Нет токена — отказ

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.sendStatus(403); // Токен неверный или истек
    req.user = user; // Теперь в любом роуте доступен req.user.id
  });
};

// Используй это в роутах
app.get("/isAuth", (req, res) => {
  authenticateToken(req, res);

  res.sendStatus(200);
});

const PORT = 4444;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
