import express from "express";
import axios from "axios";
import authenticateToken from "../middleware/authToken.js";

const artistsRoutes = express.Router();

artistsRoutes.get("/artist/:id", async (req, res) => {
  const artistId = req.params.id;
  try {
    const response = await fetch(`https://api.deezer.com/artist/${artistId}`);
    const data = await response.json();

    res.json({
      id: data.id,
      name: data.name,
      image: data.picture_big,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to get fresh link" });
  }
});

artistsRoutes.get("/chart", async (req, res) => {
  try {
    const response = await axios.get(`https://api.deezer.com/chart/0/artists`);

    const artists = response.data.data.map((artist) => ({
      id: artist.id,
      name: artist.name,
      image: artist.picture_big,
    }));

    res.json(artists);
  } catch (error) {
    res.status(500).json({ message: "Error fetching artists" });
  }
});

artistsRoutes.get("/albums/:id", async (req, res) => {
  const artistId = req.params.id;

  try {
    const response = await axios.get(
      `https://api.deezer.com/artist/${artistId}/albums`,
    );

    const albums = response.data.data.map((album) => ({
      id: album.id,
      title: album.title,
      image: album.cover_big,
    }));

    res.json(albums);
  } catch (error) {
    res.status(500).json({ message: "Error fetching alboms" });
  }
});

export default artistsRoutes;
