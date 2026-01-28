import express from "express";
import cors from "cors";

import authRoutes from "./src/routes/auth.js";
import songsRoutes from "./src/routes/song.js";
import favoriteRoutes from "./src/routes/favorites.js";
import artistsRoutes from "./src/routes/artists.js";
import albumRoutes from "./src/routes/album.js";


const app = express();
app.use(express.json());
app.use(cors());


app.use("/auth", authRoutes);
app.use("/songs", songsRoutes);
app.use("/favorites", favoriteRoutes);
app.use("/artists", artistsRoutes); 
app.use("/albums", albumRoutes); 



const PORT = 4444;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
