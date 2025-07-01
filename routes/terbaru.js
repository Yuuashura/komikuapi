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
    const terbaru = [];

    $("#Terbaru article.ls8").each((i, el) => {
      const a = $(el).find("a").first();
      const title =
        $(el).find("img").attr("alt")?.replace("Baca Komik ", "").trim() ||
        $(el).find("h3").text().trim();
      const originalLink = a.attr("href");
      const thumbnail =
        $(el).find("img").attr("data-src") || $(el).find("img").attr("src");

      let mangaSlug = "";
      let isChapter = false;
      let chapterSlug = "";
      let chapterNumber = "";

      if (originalLink) {
        if (originalLink.includes("-chapter-")) {
          isChapter = true;
          const chapterMatches = originalLink.match(
            /\/([^/]+)-chapter-([^/]+)\//
          );
          if (chapterMatches && chapterMatches[1] && chapterMatches[2]) {
            chapterSlug = chapterMatches[1];
            chapterNumber = chapterMatches[2];
            mangaSlug = chapterSlug;
          }
        } else {
          const mangaMatches = originalLink.match(/\/manga\/([^/]+)/);
          if (mangaMatches && mangaMatches[1]) {
            mangaSlug = mangaMatches[1];
          }
        }
      }

      let apiLink = "";
      if (isChapter && chapterSlug && chapterNumber) {
        apiLink = `/baca-chapter/${chapterSlug}/${chapterNumber}`;
      } else if (mangaSlug) {
        apiLink = `/detail-komik/${mangaSlug}`;
      } else {
        apiLink = originalLink;
      }

      terbaru.push({
        title,
        originalLink: originalLink?.startsWith("http")
          ? originalLink
          : `https://komiku.id${originalLink}`,
        apiLink,
        isChapter,
        type: isChapter ? "chapter" : "manga",
        thumbnail,
        ...(isChapter && {
          chapterNumber,
          mangaSlug,
          detailLink: `/detail-komik/${mangaSlug}`,
        }),
      });
    });

    res.json(terbaru);
  } catch (err) {
    res.status(500).json({
      error: "Gagal mengambil komik terbaru",
      detail: err.message,
    });
  }
});

module.exports = router;
