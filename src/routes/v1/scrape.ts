import express from 'express';
import { AmazonScrapper } from '../../scrapers/amazon.scraper';
import { FlipkartScraper } from '../../scrapers/flipkart.scraper';

const router = express.Router();

router.post("/amazon/url", async (req, res) => {
    const { url } = req.body;

    if (!url) {
        res.status(400).json({ message: 'URL is required' });
        return;
    }

    try {
        const scraper = new AmazonScrapper();
        const product = await scraper.scrapeProduct(url);
        res.status(200).json(product);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
})

router.post("/flipkart/url", async (req, res) => {
    const { url } = req.body;

    if (!url) {
        res.status(400).json({ message: 'URL is required' });
        return;
    }

    try {
        const scraper = new FlipkartScraper();
        const product = await scraper.scrapeProduct(url);
        res.status(200).json(product);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
})

export default router;