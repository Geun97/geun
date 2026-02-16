import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json({ limit: "2mb" }));

app.get("/", (req, res) => res.send("Observer API Running"));
app.get("/health", (req, res) => res.json({ ok: true }));

app.post("/api/analyze", async (req, res) => {
  const { myLandingUrl, competitors = [] } = req.body || {};

  if (!myLandingUrl || !competitors.length) {
    return res.status(400).json({ error: "missing input" });
  }

  return res.json({
    my: { landing: { url: myLandingUrl } },
    competitors: [],
    meta: { demoModeUsed: false }
  });
});

const PORT = process.env.PORT || 8787;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
