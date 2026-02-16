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

// API: Health Check (Simple)
app.get('/api/health', (req, res) => {
  res.json({ ok: true, message: "Server is running (Docker/Node)", timestamp: new Date().toISOString() });
});

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
      messageKo: "서버 내부 오류가 발생했습니다.",
      debug: error.message
    });
  }
});

// API: Debug Scrape (Returns Screenshot)
app.post('/api/debug-scrape', async (req, res) => {
  const { metaAdLibraryUrl } = req.body;
  if (!metaAdLibraryUrl) return res.status(400).json({ error: "URL required" });

  try {
    console.log(`[Debug] Scraping: ${metaAdLibraryUrl}`);
    const result = await scrapeMetaAds(metaAdLibraryUrl, 1); // Limit 1 for speed

    if (!result.ok && result.debugScreenshot) {
      // Return HTML with image to visualize immediately
      const html = `
                <h1>Scrape Failed</h1>
                <p>Error: ${result.debug}</p>
                <img src="data:image/jpeg;base64,${result.debugScreenshot}" style="max-width:100%; border:1px solid red;">
             `;
      res.set('Content-Type', 'text/html');
      res.send(html);
    } else if (result.ok) {
      res.json(result);
    } else {
      res.status(500).json(result);
    }
  } catch (e) {
    res.status(500).json({ error: e.message });
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
