import { parseGradeRange, gradeToNumber, normalizeGrade } from '../utils/parser';
import { ClassListing } from '../types';

export function matchesGrade(gradeRange: string, targetGrade: string): boolean {
  if (!gradeRange || !targetGrade) return false;

  const range = parseGradeRange(gradeRange);
  if (!range) return false;

  const targetNum = gradeToNumber(targetGrade);
  const startNum = gradeToNumber(range.start);
  const endNum = gradeToNumber(range.end);

  if (targetNum === -999 || startNum === -999 || endNum === -999) {
    // Fallback to string comparison if parsing failed
    const normalizedTarget = normalizeGrade(targetGrade);
    const normalizedStart = normalizeGrade(range.start);
    const normalizedEnd = normalizeGrade(range.end);

    return normalizedTarget === normalizedStart || normalizedTarget === normalizedEnd;
  }

  return targetNum >= startNum && targetNum <= endNum;
}

export function filterByGrade(listings: ClassListing[], targetGrade?: string): ClassListing[] {
  if (!targetGrade) {
    return listings;
  }

  return listings.filter((listing) => matchesGrade(listing.gradeRange, targetGrade));
}
