export interface ClassListing {
  name: string;
  gradeRange: string;
  sessionId: string;
  sessionDetailUrl: string;
}

export interface ClassDetail {
  instructor: string;
  instructorBackground: string;
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

export interface ClassData {
  metadata: {
    scrapedAt: string;
    campId: number;
    campCode: string;
    locationId: number;
    gradeFilter?: string;
    totalClasses: number;
  };
  classes: EnrichedClass[];
}

export type DayOfWeek = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday';

export interface ClassesByDayAndTime {
  [timeSlot: string]: Record<DayOfWeek, EnrichedClass[]>;
}

export interface ScraperConfig {
  idCamp: number;
  campCode: string;
  idLocation: number;
  gradeFilter?: string;
  rateLimit: number;
  timeout: number;
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
