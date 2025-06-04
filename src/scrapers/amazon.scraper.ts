import { chromium, type Page } from 'playwright';

interface AmazonProduct {
    title: string;
    price: string;
    availability: string;
    timestamp: string;
}

export class AmazonScrapper {
    private page: Page | null = null;
    async scrapeProduct(url: string): Promise<AmazonProduct> {
        const browser = await chromium.launch({ headless: true });
        try {
            this.page = await browser.newPage();
            console.log(`Navigating to ${url}`);
            await this.page.goto(url, { waitUntil: "domcontentloaded" });
            console.log(`Page title: ${await this.page.title()}`);

            const product = {
                title: await this.getTextContent('span#productTitle'),
                price: await this.getTextContent('.a-price-whole >> nth=0'),
                availability: await this.getTextContent('#availability span'),
                timestamp: JSON.stringify(new Date())
            };

            console.log(product);
            return product
        } catch (error) {
            console.error("Error launching browser:", error);
            throw error;
        } finally {
            await browser.close();
        }
    }

    private async getTextContent(selector: string): Promise<string> {
        if (!this.page) {
            throw new Error("Page is not initialized");
        }
        await this.page.waitForSelector(selector, { state: 'attached' });
        const element = this.page.locator(selector).first();
        return (await element.innerText()).trim();
    }
}