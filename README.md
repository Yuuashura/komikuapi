<!-- GitAds-Verify: WBSRH26RS33MFZHKP3H9ZYH6UFSEW5LS -->

## GitAds Sponsored

[![Sponsored by GitAds](https://gitads.dev/v1/ad-serve?source=vernsg/komiku-rest-api@github)](https://gitads.dev/v1/ad-track?source=vernsg/komiku-rest-api@github)

<p align="center">
  <a href="https://github.com/VernSG">
    <img src="https://avatars.githubusercontent.com/u/68459009?v=4" alt="Logo" width="150" >
  </a>

  <h3 align="center">Mangaverse-API</h3>

  <p align="center">
    <samp>A RESTful API for scraping and serving manga/manhwa/manhua data from <a href="http://komiku.id/">Komiku.id.</a></samp>
    <br />
    <a href="#table-of-contents"><strong>Explore the api »</strong></a>
    <br />
  </p>
</p>

## Table of Contents

- [Introduction](#introduction)
- [Base URL](#base-url)
- [Endpoints](#endpoints)
  - [Library (Pustaka)](#library-pustaka)
- [Response Structure](#response-structure)
- [Status Codes](#status-codes)
- [Error Handling](#error-handling)
- [Rate Limiting](#rate-limiting)

## Introduction

Mangaverse API provides access to manga, manhwa, and manhua data scraped from Komiku.id. This API allows developers to build applications that can display comics with anti-scraping protection and rate limiting features.

## Base URL

```
http://localhost:3000
```

## Endpoints

### Library (Pustaka)

Get manga listings with pagination support.

```
GET /pustaka
GET /pustaka/:page
```

#### Parameters

| Parameter | Type   | Description            | Example |
| --------- | ------ | ---------------------- | ------- |
| page      | Number | Page number (optional) | 1, 2, 3 |

#### Response Example

```json
{
  "page": 1,
  "results": [
    {
      "title": "Stuck in a Glitch Novel as an Extra",
      "thumbnail": "https://thumbnail.komiku.id/...",
      "type": "Manhwa",
      "genre": "Fantasi",
      "url": "https://komiku.id/manga/...",
      "description": "Kisah ini menyoroti perjuangan...",
      "stats": "~ pembaca • 9 jam lalu • Berwarna",
      "firstChapter": {
        "title": "Chapter 1",
        "url": "/stuck-in-a-glitch..."
      },
      "latestChapter": {
        "title": "Chapter 25",
        "url": "/stuck-in-a-glitch..."
      }
    }
  ]
}
```

## Response Structure

All responses are in JSON format and include:

- `page`: Current page number
- `results`: Array of manga items with detailed information

## Status Codes

| Code | Description                      |
| ---- | -------------------------------- |
| 200  | Success                          |
| 429  | Too Many Requests (Rate Limited) |
| 500  | Server Error                     |

## Error Handling

Error responses follow this format:

```json
{
  "error": "Failed to fetch manga data"
}
```

## Rate Limiting

The API implements rate limiting to prevent abuse:

- Window: 15 minutes
- Max Requests: 100 requests per IP address
- When limit is exceeded, returns 429 status code

---

## Disclaimer

This API scrapes data from Komiku.id and is intended for educational purposes only. The creators of this API are not responsible for any misuse or violation of Komiku.id's terms of service.
