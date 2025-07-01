const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const router = express.Router();

const URL = "https://komiku.org/";

router.get("/", async (req, res) => {
  try {
    const { data } = await axios.get(URL, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
        "Cache-Control": "public, max-age=3600", // Cache for 1 hour
      },
      timeout: 10000, // Optional: 10 seconds timeout
    });

    const $ = cheerio.load(data);
    const trending = [];

    $("#Trending_Komik article.ls2").each((i, el) => {
      const a = $(el).find("a").first();
      const title = a.attr("alt")?.replace("Baca Komik ", "").trim();
      const originalLink = a.attr("href");
      const thumbnail = $(el).find("img").attr("src");

      let slug = "";
      if (originalLink) {
        const matches = originalLink.match(/\/manga\/([^/]+)/);
        if (matches && matches[1]) {
          slug = matches[1];
        }
      }

      const apiDetailLink = slug ? `/detail-komik/${slug}` : originalLink;

      trending.push({
        title,
        originalLink: originalLink?.startsWith("http")
          ? originalLink
          : `https://komiku.id${originalLink}`,
        apiDetailLink,
        thumbnail,
      });
    });

    res.json(trending);
  } catch (err) {
    res.status(500).json({
      error: "Gagal mengambil komik trending",
      detail: err.message,
    });
  }
});

module.exports = router;
