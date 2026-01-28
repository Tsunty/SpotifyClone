import express from "express";
import axios from "axios";
import authenticateToken from "../middleware/authToken.js";

const songsRoutes = express.Router();

songsRoutes.get("/songID/:id", async (req, res) => {
  const trackId = req.params.id;
  try {
    const response = await fetch(`https://api.deezer.com/track/${trackId}`);
    const data = await response.json();

    res.json({
      id: data.id,
      url: data.preview,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to get fresh link" });
  }
});

songsRoutes.get("/chart", async (req, res) => {
  try {
    await authenticateToken(req, res);
    const response = await axios.get(`https://api.deezer.com/chart/0/tracks`);

    const songs = response.data.data.map((track) => ({
      id: track.id,
      title: track.title,
      artist: track.artist.name,
      duration: track.duration,
      image: track.album.cover_big,
    }));

    res.json(songs);
  } catch (error) {
    res.status(500).json({ message: "Error fetching songs" });
  }
});

songsRoutes.get("/search/:query", async (req, res) => {
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

export default songsRoutes;
