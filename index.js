const express = require("express");

// Tambahkan penanganan error global
process.on("uncaughtException", (err) => {
  console.error("Ada error yang tidak tertangkap:", err);
  // Tidak exit process agar aplikasi tetap berjalan
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
  // Tidak exit process agar aplikasi tetap berjalan
});

const app = express();
const port = process.env.PORT || 3001;
const rateLimiter = require("./middleware/rateLimiter");

app.use(rateLimiter);

// Middleware for CORS
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }
  next();
});

const rekomendasiRoute = require("./routes/rekomendasi");
const trendingRoute = require("./routes/trending");
const terbaruRoute = require("./routes/terbaru");
const pustakaRouter = require("./routes/pustaka");
const komikPopulerRoute = require("./routes/komik-populer");
const detailKomikRoute = require("./routes/detail-komik");
const bacaChapterRoute = require("./routes/baca-chapter");
const searchRoute = require("./routes/search");
const terbaruRoute2 = require("./routes/terbaru-2");
const berwarnaRoute = require("./routes/berwarna");
const genreAll = require("./routes/genre-all");
const genreDetail = require("./routes/genre-detail");
const genreRekomendasi = require("./routes/genre-rekomendasi");

// Root route
app.get("/", (req, res) => {
  res.json({
    message: "Wellcome To My API",
    version: "1.0.0",
    author: "Ⓨⓤⓤⓐⓢⓗⓤⓡⓐ",
    github: "https://github.com/Yuuashura",
    endpoints: [
      "/rekomendasi",
      "/trending",
      "/terbaru-2",
      "/pustaka",
      "/berwarna",
      "/komik-populer",
      "/detail-komik/:slug",
      "/baca-chapter/:slug/:chapter",
      "/search?q=keyword",
      "/genre/:slug",
      "/genre-rekomendasi/:slug",
      "/genre-all",
    ],
    example : [
      "/detail-komik/one-piece",
      "/baca-chapter/one-piece/1",
      "/search?q=one piece",
      "/genre/action",
      "/genre-rekomendasi/one-piece",
      "/genre-all"
    ]
  });
});

app.use("/rekomendasi", rekomendasiRoute);
app.use("/trending", trendingRoute);
app.use("/terbaru", terbaruRoute);
app.use("/pustaka", pustakaRouter);
app.use("/komik-populer", komikPopulerRoute);
app.use("/detail-komik", detailKomikRoute);
app.use("/baca-chapter", bacaChapterRoute);
app.use("/terbaru-2", terbaruRoute2);
app.use("/search", searchRoute);
app.use("/berwarna", berwarnaRoute);
app.use("/genre-all", genreAll);
app.use("/genre-rekomendasi", genreRekomendasi);
app.use("/genre", genreDetail);

app.listen(port, () => {
  console.log(`Server jalan di http://localhost:${port}`);
});

module.exports = app;
