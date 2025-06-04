import express from 'express';
import { AmazonScrapper } from '../../scrapers/amazon.scraper';

const router = express.Router();

router.post("/url", async (req, res) => {
    const { url } = req.body;

    if (!url) {
        res.status(400).json({ message: 'URL is required' });
        return;
    }

    try {
        // Simulate scraping logic
        // In a real application, you would use a library like axios or node-fetch to fetch the URL content
        // and then parse it using a library like cheerio or jsdom.

        const scraper = new AmazonScrapper();
        const product = await scraper.scrapeProduct(url);
        res.status(200).json(product);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
})

export default router;