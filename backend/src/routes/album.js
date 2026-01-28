import express from "express";
import axios from "axios";
import authenticateToken from "../middleware/authToken.js";

const albumRoutes = express.Router();

albumRoutes.get("/album/:id", async (req, res) => {
  const albumId = req.params.id;
  try {
    const response = await fetch(
      `https://api.deezer.com/album/${albumId}/tracks`,
    );
    const result = await response.json(); // Deezer вернет { data: [...] }

    // Проверяем, есть ли данные
    if (!result.data) {
      return res.status(404).json({ error: "Tracks not found" });
    }

    // Формируем массив треков для фронтенда
    const trackPromises = result.data.map(async (track) => {
      // Пример: делаем доп. запрос для каждого трека (если нужно)
      const detailRes = await fetch(`https://api.deezer.com/track/${track.id}`);
      const detailData = await detailRes.json();

      return {
        id: track.id,
        title: track.title,
        image: detailData.album.cover_medium,
        url: track.preview,
        duration: track.duration,
        artist: track.artist.name,
      };
    });

    const tracks = await Promise.all(trackPromises);

    res.json(tracks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch tracks" });
  }
});

albumRoutes.get("/chart", async (req, res) => {
  try {
    const response = await axios.get(`https://api.deezer.com/chart/0/albums`);

    const albums = response.data.data.map((album) => ({
      id: album.id,
      title: album.title,
      image: album.cover_big,
      artist: {
        id: album.artist.id,
        name: album.artist.name,
      },
    }));

    res.json(albums);
  } catch (error) {
    res.status(500).json({ message: "Error fetching artists" });
  }
});

albumRoutes.get("/search/:query", async (req, res) => {
  try {
    await authenticateToken(req, res);
    const query = req.params.query || "eminem";
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

export default albumRoutes;
