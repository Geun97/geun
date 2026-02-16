const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');

puppeteer.use(StealthPlugin());

/**
 * Scrapes Meta Ad Library for active ads.
 * @param {string} url - The Meta Ad Library URL (e.g., ?id=... or view_all_page_id=...)
 * @param {number} limit - Max number of ads to return (default 10)
 * @returns {Promise<Object>} - { ok: boolean, items: Array, warning: string }
 */
async function scrapeMetaAds(url, limit = 10) {
    let browser;
    try {
        // Launch browser with more stealth options and arguments for Render
        browser = await puppeteer.launch({
            headless: "new",
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-accelerated-2d-canvas',
                '--no-first-run',
                '--no-zygote',
                '--single-process',
                '--disable-gpu'
            ]
        });

        const page = await browser.newPage();

        // Set viewport & User Agent to look like a real user
        await page.setViewport({ width: 1280, height: 800 });
        await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

        // Removed Request Interception (Resource Blocking) to prevent hangs
        // Some sites hang if CSS/Fonts are blocked.

        // Navigate
        console.log(`[Scraper] Navigating to ${url}`);
        // Change from networkidle2 to domcontentloaded to prevent hanging on background requests
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });

        // Debug info
        const pageTitle = await page.title();
        const currentUrl = page.url();
        console.log(`[Scraper] Loaded. Title: "${pageTitle}", URL: "${currentUrl}"`);

        // Check for Login Wall / Captcha
        if (pageTitle.includes("Log In") || pageTitle.includes("로그인") || currentUrl.includes("login")) {
            console.warn("[Scraper] Login Wall detected.");
            throw new Error(`Login Wall detected. Title: ${pageTitle}`);
        }

        // Wait for *some* content to ensure it's not a blank page
        // 5 seconds max waiting for body/div
        try {
            await page.waitForSelector('body', { timeout: 5000 });
        } catch (e) { }

        // Scroll to trigger lazy loading
        await autoScroll(page);

        // Scroll to trigger lazy loading
        await autoScroll(page);

        // Wait for ad cards (try multiple potential selectors)
        // Meta DOM is obfuscated, but usually has role="article" or specific divs
        try {
            await page.waitForSelector('div[role="article"], div[data-pagelet]', { timeout: 8000 });
        } catch (e) {
            console.warn("[Scraper] Timeout waiting for selector. Attempting extraction anyway.");
        }

        // Extract Data using page.evaluate (Running logic inside browser)
        const ads = await page.evaluate((limit) => {
            // --- Helpers from original snippet ---
            const norm = (s) => (s ?? "").toString().replace(/\s+\n/g, "\n").replace(/\n{3,}/g, "\n\n").trim();
            const pickText = (root, selectors) => {
                for (const sel of selectors) {
                    const el = root.querySelector(sel);
                    const t = norm(el?.innerText || el?.textContent);
                    if (t) return t;
                }
                return "";
            };
            const firstImage = (root) => {
                // Video poster or img src
                const video = root.querySelector('video');
                if (video && video.poster) return video.poster;
                const img = root.querySelector('img');
                return img?.src || "";
            };
            const guessFormat = (root) => {
                const hasVideo = !!root.querySelector('video, [data-visualcompletion="media-vc-image"] video');
                if (hasVideo) return "video";
                const imgs = root.querySelectorAll("img");
                if (imgs.length >= 2) return "carousel";
                if (imgs.length === 1) return "image";
                return "unknown";
            };

            // --- Selection Logic ---
            const candidates = Array.from(document.querySelectorAll('div[role="article"], div[data-pagelet], div'))
                .filter(el => {
                    const txt = (el.innerText || "").trim();
                    // Filter out small nav/footer elements
                    if (txt.length < 50) return false;
                    // Must have a button or link (CTA)
                    return !!el.querySelector('a[role="link"], div[role="button"], button');
                });

            const seen = new Set();
            const results = [];

            for (const card of candidates) {
                if (results.length >= limit) break;

                // Signature for dedupe
                const sig = ((card.innerText || "").replace(/\s+/g, " ").trim()).slice(0, 100);
                if (!sig || seen.has(sig)) continue;
                seen.add(sig);

                // Extract Fields
                const primary_text = pickText(card, ['div[data-ad-preview="message"]', 'div[dir="auto"]', 'span[dir="auto"]']);
                const headline = pickText(card, ['div[data-ad-preview="headline"]', 'strong', 'h4', 'h3']);
                const cta = pickText(card, ['div[role="button"] span', 'button span', 'a[role="link"] span']);
                const media_preview_url = firstImage(card);

                // Landing URL
                const links = Array.from(card.querySelectorAll("a[href]"))
                    .map(a => a.href)
                    .filter(h => h && !h.includes("facebook.com") && !h.includes("fb.com") && !h.startsWith("javascript:"));

                // Heuristic: If valid ad
                if ((primary_text && primary_text.length > 10) || media_preview_url) {
                    results.push({
                        primary_text,
                        headline,
                        cta,
                        media_preview_url,
                        landing_url: links[0] || null,
                        format: guessFormat(card)
                    });
                }
            }
            return results;
        }, limit);

        if (ads.length === 0) {
            // Capture screenshot for debugging no ads
            let screenshot = null;
            try {
                screenshot = await page.screenshot({ encoding: 'base64', type: 'jpeg', quality: 50 });
            } catch (e) { }

            return {
                ok: false,
                errorCode: "NO_ADS_FOUND",
                messageKo: "광고를 찾지 못했습니다. (페이지 로드 성공했으나 데이터 없음)",
                debug: `Title: ${pageTitle}, URL: ${currentUrl}`,
                debugScreenshot: screenshot
            };
        }

        return { ok: true, items: ads };

    } catch (error) {
        console.error("[Scraper] Failed:", error);

        // Capture screenshot for debugging error
        let screenshot = null;
        try {
            if (page) screenshot = await page.screenshot({ encoding: 'base64', type: 'jpeg', quality: 50 });
        } catch (e) { }

        return {
            ok: false,
            errorCode: "SCRAPE_FAILED",
            messageKo: "메타 광고 라이브러리 접근에 실패했습니다. (차단됨 또는 오류)",
            debug: `${error.message}`,
            debugScreenshot: screenshot
        };
    } finally {
        if (browser) await browser.close();
    }
}

async function autoScroll(page) {
    await page.evaluate(async () => {
        await new Promise((resolve) => {
            let totalHeight = 0;
            const distance = 100;
            const timer = setInterval(() => {
                const scrollHeight = document.body.scrollHeight;
                window.scrollBy(0, distance);
                totalHeight += distance;

                // Stop if scraped enough or reached bottom (heuristic)
                if (totalHeight >= 3000 || totalHeight >= scrollHeight) {
                    clearInterval(timer);
                    resolve();
                }
            }, 100);
        });
    });
}

module.exports = { scrapeMetaAds };
