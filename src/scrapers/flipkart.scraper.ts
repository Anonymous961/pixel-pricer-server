import { BaseScraper } from "./base.scraper";

// Updated Flipkart Scraper Implementation
interface FlipkartProduct {
    name: string;
    currentPrice: string;
    originalPrice?: string;  // Made optional
    rating?: string;         // Made optional
    timestamp: string;
}

export class FlipkartScraper extends BaseScraper {
    getProductSelectors() {
        return {
            name: 'span.VU-ZEz',
            currentPrice: 'div._30jeq3',
            originalPrice: 'div._3I9_wc',
            rating: 'div._3LWZlK',
            // Alternative selectors for fallback
            altName: 'h1.yhB1nd',
            altPrice: 'div._16Jk6d'
        };
    }

    async scrapeProduct(url: string): Promise<FlipkartProduct> {
        try {
            await this.init();
            console.log(`Navigating to ${url}`);
            await this.page?.goto(url, {
                waitUntil: 'domcontentloaded',
                timeout: 60000
            });
            // console.log(await this.page?.content());

            // Block detection
            if (await this.page?.locator('text=Access Denied').isVisible()) {
                throw new Error('Flipkart blocked the request');
            }

            // Extract JSON-LD content
            const jsonLD = await this.page?.locator('script[type="application/ld+json"]').allTextContents();

            let productData: any;
            if (jsonLD) {
                for (const raw of jsonLD) {
                    try {
                        const parsed = JSON.parse(raw);
                        if (Array.isArray(parsed)) {
                            const productEntry = parsed.find((e) => e["@type"] === "Product");
                            if (productEntry) {
                                productData = productEntry;
                                break;
                            }
                        } else if (parsed["@type"] === "Product") {
                            productData = parsed;
                            break;
                        }
                    } catch (e) {
                        console.warn("Failed to parse JSON-LD:", e);
                    }
                }
            }

            if (productData) {
                return {
                    name: productData.name || "N/A",
                    currentPrice: productData.offers?.price?.toString() || "N/A",
                    originalPrice: undefined, // JSON-LD may not include this
                    rating: productData.aggregateRating?.ratingValue?.toString(),
                    timestamp: new Date().toISOString(),
                };
            }

            // Fallback to DOM scraping
            const selectors = this.getProductSelectors();
            const product: FlipkartProduct = {
                name: await this.getTextWithFallback([selectors.name, selectors.altName]),
                currentPrice: await this.getTextWithFallback([selectors.currentPrice, selectors.altPrice]),
                timestamp: new Date().toISOString()
            };

            try {
                product.originalPrice = await this.getTextContent(selectors.originalPrice);
            } catch {
                console.warn("Original price not found");
            }

            try {
                product.rating = await this.getTextContent(selectors.rating);
            } catch {
                console.warn("Rating not found");
            }

            return product;
        } finally {
            await this.close();
        }
    }

    private async getTextWithFallback(selectors: string[]): Promise<string> {
        for (const selector of selectors) {
            try {
                return await this.getTextContent(selector);
            } catch (error) {
                console.warn(`Selector failed: ${selector}`);
            }
        }
        throw new Error(`All selectors failed: ${selectors.join(', ')}`);
    }
}