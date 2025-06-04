import { chromium, type Page, type Browser } from 'playwright';

export abstract class BaseScraper {
    protected page: Page | null = null;
    protected browser: Browser | null = null;

    async init() {
        this.browser = await chromium.launch({ headless: true, args: ['--disable-blink-features=AutomationControlled'] })
        this.page = await this.browser.newPage();
        await this.page.setViewportSize({ width: 1280, height: 800 });
    }

    async close() {
        if (this.browser) {
            await this.browser.close();
        }
    }

    protected async getTextContent(selector: string): Promise<string> {
        if (!this.page) {
            throw new Error("Page is not initialized");
        }
        await this.page.waitForSelector(selector, { state: 'attached' });
        return (await this.page.locator(selector).first().innerText()).trim();
    }

    protected async getAttribute(selector: string, attr: string): Promise<string> {
        if (!this.page) {
            throw new Error("Page is not initialized");
        }
        await this.page.waitForSelector(selector, { state: 'attached' });
        return (await this.page.locator(selector).first().getAttribute(attr)) || "";
    }

    // Abstract methods that child classes must implement
    abstract scrapeProduct(url: string): Promise<any>;
    abstract getProductSelectors(): Record<string, string>;
}