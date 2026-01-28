import express from "express";
import db from "../config/db.js";

const favoriteRoutes = express.Router();


// Добавления/удаления лайка
favoriteRoutes.post("/toggle", async (req, res) => {
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



// Получения объекта любимых треков пользователя
favoriteRoutes.get("/playlist/:userId", (req, res) => {
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



// Получение массива ID избранных треков юзера
favoriteRoutes.get("/ArrIds/:userId", (req, res) => {
  db.all(
    "SELECT trackId FROM favorites WHERE userId = ?",
    [req.params.userId],
    (err, rows) => {
      if (err) return res.status(500).json(err);
      const ids = rows.map((row) => row.trackId);
      res.json(ids);
    },
  );
});

export default favoriteRoutes