export interface ScraperConfig {
  idCamp: number;
  campCode: string;
  idLocation: number;
  gradeFilter?: string;
  rateLimit?: number;
  timeout?: number;
}

export interface ClassListing {
  name: string;
  gradeRange: string;
  sessionId: string;
  sessionDetailUrl: string;
}

export interface ClassDetail {
  name: string;
  instructor: string;
  instructorBackground?: string;
  gradeLevels: string;
  dayOfWeek: string;
  time: string;
  startDate: string;
  endDate: string;
  numberOfClasses?: number;
  specificDates?: string[];
  location: string;
  cost: string;
  registrationOpens?: string;
  programOverview: string;
  learningOutcomes?: string[];
  specialFocus?: string[];
}

export interface EnrichedClass extends ClassListing, ClassDetail {}

export interface GradeRange {
  start: string;
  end: string;
}

export interface ExportOptions {
  format: 'yaml' | 'csv' | 'both';
  outputDir: string;
  filename?: string;
}

export interface ExportMetadata {
  scrapedAt: string;
  campId: number;
  campCode: string;
  locationId: number;
  gradeFilter?: string;
  totalClasses: number;
}

export interface YAMLOutput {
  metadata: ExportMetadata;
  classes: EnrichedClass[];
}
