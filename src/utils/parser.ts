import { GradeRange } from '../types';

const GRADE_MAP: Record<string, string> = {
  'kindergarten': 'K',
  'k': 'K',
  'tk': 'TK',
  '1st': '1st',
  '1': '1st',
  'first': '1st',
  '2nd': '2nd',
  '2': '2nd',
  'second': '2nd',
  '3rd': '3rd',
  '3': '3rd',
  'third': '3rd',
  '4th': '4th',
  '4': '4th',
  'fourth': '4th',
  '5th': '5th',
  '5': '5th',
  'fifth': '5th',
  '6th': '6th',
  '6': '6th',
  'sixth': '6th',
  '7th': '7th',
  '7': '7th',
  'seventh': '7th',
  '8th': '8th',
  '8': '8th',
  'eighth': '8th',
};

export function normalizeGrade(input: string): string {
  const cleaned = input.toLowerCase().trim();
  return GRADE_MAP[cleaned] || input;
}

export function gradeToNumber(grade: string): number {
  const normalized = normalizeGrade(grade);
  if (normalized === 'TK') return -1;
  if (normalized === 'K') return 0;

  const match = normalized.match(/^(\d+)/);
  if (match) {
    return parseInt(match[1], 10);
  }

  return -1;
}

export function parseGradeRange(text: string): GradeRange | null {
  if (!text) return null;

  const cleaned = text.trim();

  // Handle "Grade X" or "Grades X" (single grade)
  const singleMatch = cleaned.match(/Grades?\s+([A-Za-z0-9]+)$/i);
  if (singleMatch) {
    const grade = normalizeGrade(singleMatch[1]);
    return { start: grade, end: grade };
  }

  // Handle "Grades X - Y" or "Grades X-Y"
  const rangeMatch = cleaned.match(/Grades?\s+([A-Za-z0-9]+)\s*-\s*([A-Za-z0-9]+)/i);
  if (rangeMatch) {
    return {
      start: normalizeGrade(rangeMatch[1]),
      end: normalizeGrade(rangeMatch[2]),
    };
  }

  return null;
}

export function extractSessionId(url: string): string {
  const match = url.match(/idSession=(\d+)/);
  return match ? match[1] : '';
}

export function parseCurrency(text: string): string {
  if (!text) return '';
  const match = text.match(/\$[\d,]+\.?\d*/);
  return match ? match[0] : text;
}

export function cleanText(text: string): string {
  return text.trim().replace(/\s+/g, ' ');
}
