const express = require('express');
const cors = require('cors');
const path = require('path');
const { scrapeMetaAds } = require('./scraper');

const app = express();
const PORT = process.env.PORT || 8787;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// API: Scrape Meta Ads
app.post('/api/scrape/meta-ads', async (req, res) => {
  const { metaAdLibraryUrl, limit = 10 } = req.body;

  if (!metaAdLibraryUrl) {
    return res.status(400).json({
      ok: false,
      errorCode: "MISSING_URL",
      messageKo: "Meta 광고 라이브러리 URL이 필요합니다."
    });
  }

  console.log(`[Scrape] Starting for: ${metaAdLibraryUrl}`);

  try {
    const result = await scrapeMetaAds(metaAdLibraryUrl, limit);
    res.json(result);
  } catch (error) {
    console.error("[Scrape] Error:", error);
    res.status(500).json({
      ok: false,
      errorCode: "INTERNAL_ERROR",
      messageKo: "서버 내부 오류가 발생했습니다."
    });
  }
});

// Fallback for SPA (if we had client-side routing, but here just serve index)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`- Frontend: http://localhost:${PORT}`);
  console.log(`- Scraper API: http://localhost:${PORT}/api/scrape/meta-ads`);
});
