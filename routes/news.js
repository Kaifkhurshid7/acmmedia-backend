const router = require("express").Router();
const axios = require("axios");
const NodeCache = require("node-cache");

// Cache for 30 minutes (1800 seconds)
const newsCache = new NodeCache({ stdTTL: 1800 });
const CACHE_KEY = "tech-news-v2";

const getFallbackArticles = (reason) => ([
    {
        title: "Tech News Temporarily Unavailable",
        description: reason || "The external news provider is unavailable right now. Please try again shortly.",
        url: "#",
        image: null,
        publishedAt: new Date().toISOString(),
        source: "ACM Media"
    }
]);

router.get("/", async (req, res) => {
    try {
        // Check cache first
        const cachedNews = newsCache.get(CACHE_KEY);
        if (cachedNews) {
            console.log("Serving news from cache");
            return res.json(cachedNews);
        }

        console.log("Fetching fresh news...");

        // Fetch from NewsAPI (Technology category)
        // Using a public free key or env variable. 
        // Ideally: process.env.NEWS_API_KEY
        // For now, I'll assume the user might not have one set, 
        // so I'll add a fallback or use a placeholder if env is missing.

        const apiKey = process.env.NEWS_API_KEY;

        if (!apiKey) {
            const fallback = getFallbackArticles("Please set NEWS_API_KEY in .env to fetch real news.");
            newsCache.set(CACHE_KEY, fallback, 300);
            return res.json(fallback);
        }


        // GNews API: https://gnews.io/docs/
        // Example endpoint: https://gnews.io/api/v4/top-headlines?topic=technology&lang=en&token=API_KEY
        const response = await axios.get('https://gnews.io/api/v4/top-headlines', {
            params: {
                topic: 'technology',
                lang: 'en',
                token: apiKey
            }
        });

        // Sanitize Data

        const rawArticles = Array.isArray(response.data.articles) ? response.data.articles : [];
        const articles = rawArticles.map(article => ({
            title: article.title,
            description: article.description,
            url: article.url,
            image: article.image,
            publishedAt: article.publishedAt,
            source: article.source?.name || (article.source ? article.source : 'GNews')
        })).filter(a => a.title && a.url); // Basic filtering

        if (articles.length === 0) {
            const fallback = getFallbackArticles("No technology headlines were returned by the news provider.");
            newsCache.set(CACHE_KEY, fallback, 300);
            return res.json(fallback);
        }

        // Save to cache
        newsCache.set(CACHE_KEY, articles);

        res.json(articles);

    } catch (err) {
        console.error("News Fetch Error:", err.response?.data || err.message);
        const fallback = getFallbackArticles();
        newsCache.set(CACHE_KEY, fallback, 300);
        res.json(fallback);
    }
});

module.exports = router;
