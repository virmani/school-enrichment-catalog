import * as cheerio from 'cheerio';
import { ClassListing, ScraperConfig } from '../types';
import { HttpClient } from '../utils/http-client';
import { extractSessionId, cleanText } from '../utils/parser';

export class ListingScraper {
  private httpClient: HttpClient;

  constructor(httpClient: HttpClient) {
    this.httpClient = httpClient;
  }

  async scrape(config: ScraperConfig): Promise<ClassListing[]> {
    const url = this.buildListingUrl(config);
    const html = await this.httpClient.get(url);
    return this.parseListingPage(html);
  }

  private buildListingUrl(config: ScraperConfig): string {
    const { idCamp, campCode, idLocation } = config;
    return `https://www.ultracamp.com/info/upcomingSessions.aspx?idCamp=${idCamp}&campCode=${campCode}&idLocation=${idLocation}`;
  }

  private parseListingPage(html: string): ClassListing[] {
    const $ = cheerio.load(html);
    const listings: ClassListing[] = [];

    // Find all session detail links
    $('a[href*="sessionDetail.aspx"]').each((_, element) => {
      try {
        const $link = $(element);
        const name = cleanText($link.text());
        const relativeUrl = $link.attr('href') || '';

        // Build full URL
        const sessionDetailUrl = relativeUrl.startsWith('http')
          ? relativeUrl
          : `https://www.ultracamp.com/info/${relativeUrl}`;

        // Extract session ID
        const sessionId = extractSessionId(sessionDetailUrl);

        // Get the parent element and its text content to find grade/price
        const $parent = $link.parent();
        const siblingText = $parent.text();

        // Look for grade in the surrounding text
        let gradeRange = '';
        const gradeMatch = siblingText.match(/Grades?\s+[A-Za-z0-9\s\-]+/i);
        if (gradeMatch) {
          gradeRange = cleanText(gradeMatch[0]);
        }

        if (name && sessionDetailUrl) {
          listings.push({
            name,
            gradeRange,
            sessionId,
            sessionDetailUrl,
          });
        }
      } catch (error) {
        console.warn('Error parsing listing:', error);
      }
    });

    return listings;
  }
}
