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
    // Support multiple location IDs (comma-separated)
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
        // Match "Grade X" or "Grades X - Y" where X/Y are valid grade patterns (P2-P4, K, TK, 1st-8th)
        // Valid patterns: P2, P3, P4, K, TK, 1st, 2nd, 3rd, 4th, 5th, 6th, 7th, 8th
        const gradeMatch = siblingText.match(/Grades?\s+(P[234]|TK|K|[1-8](?:st|nd|rd|th))(?:\s*-\s*(P[234]|TK|K|[1-8](?:st|nd|rd|th)))?/i);
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
