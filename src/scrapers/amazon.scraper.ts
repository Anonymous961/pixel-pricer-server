import { BaseScraper } from './base.scraper';

interface AmazonProduct {
    title: string;
    price: string;
    availability: string;
    timestamp: string;
}

export class AmazonScrapper extends BaseScraper {
    getProductSelectors() {
        return {
            title: 'span#productTitle',
            price: '.a-price-whole >> nth=0',
            availability: '#availability span',
            image: '#imgTagWrapperId img'
        };
    }

    async scrapeProduct(url: string): Promise<AmazonProduct> {
        try {
            await this.init();
            console.log(`Navigating to ${url}`);
            await this.page?.goto(url, { waitUntil: 'domcontentloaded' });

            const selectors = this.getProductSelectors();
            const product = {
                title: await this.getTextContent(selectors.title),
                price: await this.getTextContent(selectors.price),
                availability: await this.getTextContent(selectors.availability),
                image: await this.getAttribute(selectors.image, 'src'),
                timestamp: new Date().toISOString()
            };

            console.log('Scraped product:', product);
            return product;
        } finally {
            await this.close();
        }
    }
}