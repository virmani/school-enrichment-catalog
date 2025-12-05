import * as cheerio from 'cheerio';
import { ClassDetail } from '../types';
import { HttpClient } from '../utils/http-client';
import { cleanText, parseCurrency } from '../utils/parser';

export class DetailScraper {
  private httpClient: HttpClient;

  constructor(httpClient: HttpClient) {
    this.httpClient = httpClient;
  }

  async scrape(url: string): Promise<ClassDetail | null> {
    try {
      const html = await this.httpClient.get(url);
      return this.parseDetailPage(html);
    } catch (error) {
      console.error(`Error scraping detail page ${url}:`, error);
      return null;
    }
  }

  private parseDetailPage(html: string): ClassDetail | null {
    const $ = cheerio.load(html);

    try {
      // Get all text content to extract information
      const pageText = $('body').text();

      // Also try to get description from specific span if it exists
      const lblDescriptionText = $('#lblDescription').text() || '';

      // Extract instructor - handle both "Instructor Name:" and "Instructor:"
      let instructor = '';
      const instructorMatch = pageText.match(/Instructor(?:\s+Name)?:\s*([^\n]+)/);
      if (instructorMatch) {
        const matched = cleanText(instructorMatch[1]);
        // Don't use if it's empty or looks like a schedule line
        if (matched && !matched.match(/^(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday):/i)) {
          instructor = matched;
        }
      }

      // Extract schedule - day of week
      let dayOfWeek = '';
      const dayMatch = pageText.match(/(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday):/i);
      if (dayMatch) {
        dayOfWeek = dayMatch[1];
      }

      // Extract time
      let time = '';
      const timeMatch = pageText.match(/Time:\s*(\d{1,2}:\d{2}\s*(?:AM|PM)\s*-\s*\d{1,2}:\d{2}\s*(?:AM|PM))/i);
      if (timeMatch) {
        time = cleanText(timeMatch[1]);
      }

      // Extract dates
      let startDate = '';
      let endDate = '';
      const dateMatch = pageText.match(/Dates:\s*(\d{1,2}\/\d{1,2}\/\d{4})\s*-\s*(\d{1,2}\/\d{1,2}\/\d{4})/);
      if (dateMatch) {
        startDate = dateMatch[1];
        endDate = dateMatch[2];
      }

      // Extract number of classes
      let numberOfClasses: number | undefined;
      const classCountMatch = pageText.match(/\((\d+)\s+classes?\)/i);
      if (classCountMatch) {
        numberOfClasses = parseInt(classCountMatch[1], 10);
      }

      // Extract grade levels
      let gradeLevels = '';
      const gradeMatch = pageText.match(/Ages:\s*(Grades?\s+[A-Za-z0-9\s\-]+?)(?:\s+Cost|$)/i);
      if (gradeMatch) {
        gradeLevels = cleanText(gradeMatch[1]);
      }

      // Extract location - use multi-strategy approach
      let location = 'CAIS K-8th';

      // Strategy 1: Look for standard "CAIS K - 8th" pattern
      const caisPattern = pageText.match(/CAIS\s+K\s*-\s*8th/i);
      if (caisPattern) {
        const matched = cleanText(caisPattern[0]);
        // Validate it's just the location, not part of a sentence
        const beforeMatch = pageText.substring(Math.max(0, caisPattern.index! - 50), caisPattern.index!);
        const afterMatch = pageText.substring(caisPattern.index! + matched.length, caisPattern.index! + matched.length + 50);

        // Reject if it's part of description (contains narrative words before/after)
        const narrativeWords = /students?|adventure|exciting|program|will|class|learn/i;
        if (!narrativeWords.test(beforeMatch) && !narrativeWords.test(afterMatch.substring(0, 20))) {
          location = matched;
        }
      }

      // Strategy 2: Look for full address format
      const fullAddressMatch = pageText.match(/CAIS\s+K\s*-\s*8th[,\s]+3250\s+19th\s+Avenue[^]*?(?=Dates:|Time:|Ages:|$)/i);
      if (fullAddressMatch && fullAddressMatch[0].length < 200) {
        const addr = cleanText(fullAddressMatch[0].split(/Dates:|Time:|Ages:/)[0]);
        if (!addr.includes('function')) {
          location = addr;
        }
      }

      // Extract cost
      let cost = '';
      const costMatch = pageText.match(/Cost:\s*(\$[\d,]+\.?\d*)/);
      if (costMatch) {
        cost = costMatch[1];
      }

      // Extract program overview/description - use multiple strategies
      let programOverview = '';

      // Helper to validate description
      const isValidDescription = (text: string): boolean => {
        return (
          text.length > 20 &&
          text.length < 2000 &&
          !text.includes('function(') &&  // More specific - avoid "functional"
          !text.includes('function ') &&  // Also check for "function "
          !text.includes('gtm.start') &&
          !text.includes('getElementById') &&
          !text.includes('window.') &&
          !text.includes('document.')
        );
      };

      // Strategy 1: After instructor and day schedule, before location markers (handles multiple line breaks)
      const desc1Match = pageText.match(
        /Instructor Name:[^\n]*\n+(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday):\s*\([^\)]+\)[^\n]*\n+([^]+?)(?=Location:|Dates:|Time:|Ages:|$)/i
      );
      if (desc1Match && desc1Match[2]) {
        const desc = cleanText(desc1Match[2]);
        if (isValidDescription(desc)) {
          programOverview = desc;
        }
      }

      // Strategy 2: After "Description" heading
      if (!programOverview) {
        const desc2Match = pageText.match(
          /Description\s+(?:Instructor Name:[^\n]+\s+)?(?:[A-Za-z]+:)?[^\n]*\s+([^]+?)(?=\s+CAIS\s+K|Location:|Dates:|Time:|Ages:|$)/i
        );
        if (desc2Match && desc2Match[1]) {
          const desc = cleanText(desc2Match[1]);
          if (isValidDescription(desc)) {
            programOverview = desc;
          }
        }
      }

      // Strategy 3: Between schedule day and structured data markers
      if (!programOverview) {
        // Find where the day schedule ends (e.g., "Wednesday: (17 classes) Jan. 14...")
        const dayScheduleMatch = pageText.match(/(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday):\s*\([^)]+\)[^\n]+/i);
        if (dayScheduleMatch && dayScheduleMatch.index !== undefined) {
          const scheduleEnd = dayScheduleMatch.index + dayScheduleMatch[0].length;

          // Find next structured data (Time:, Dates:, Ages:, Cost:)
          const afterSchedule = pageText.substring(scheduleEnd);
          const structuredDataPos = afterSchedule.search(/(?:Time:|Dates:|Ages:|Cost:)/i);

          if (structuredDataPos > 50) {
            const potentialDesc = afterSchedule.substring(0, structuredDataPos);
            const desc = cleanText(potentialDesc);
            if (isValidDescription(desc)) {
              programOverview = desc;
            }
          }
        }
      }

      // Strategy 4: Extract from lblDescription span directly
      if (!programOverview && lblDescriptionText) {
        // The lblDescriptionText contains "Instructor Name: X" and day schedule at the start
        // Extract description after the day schedule
        const dayScheduleMatch = lblDescriptionText.match(/(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday):\s*\([^\)]+\)[^\n]*/i);
        if (dayScheduleMatch && dayScheduleMatch.index !== undefined) {
          const afterSchedule = lblDescriptionText.substring(dayScheduleMatch.index + dayScheduleMatch[0].length);
          const desc = cleanText(afterSchedule);

          if (isValidDescription(desc)) {
            programOverview = desc;
          }
        }
      }

      // Strategy 5: Find substantial paragraph after instructor (fallback)
      if (!programOverview) {
        const instructorPos = pageText.search(/Instructor Name:/i);
        if (instructorPos > 0) {
          const afterInstructor = pageText.substring(instructorPos + 100);
          // Look for first block of text that looks like a description
          const paragraphMatch = afterInstructor.match(/([A-Z][^]*?[.!?])\s+(?:CAIS|Location|Dates|Time|Ages|$)/);
          if (paragraphMatch && paragraphMatch[1]) {
            const desc = cleanText(paragraphMatch[1]);
            if (isValidDescription(desc)) {
              programOverview = desc;
            }
          }
        }
      }

      return {
        instructor: instructor || 'Unknown',
        instructorBackground: '',
        gradeLevels,
        dayOfWeek,
        time,
        startDate,
        endDate,
        numberOfClasses,
        location,
        cost,
        programOverview,
      };
    } catch (error) {
      console.error('Error parsing detail page:', error);
      return null;
    }
  }
}
