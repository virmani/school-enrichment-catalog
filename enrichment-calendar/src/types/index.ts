import type { Ref, ComputedRef } from 'vue';
import type { EnrichedClass as EnrichedClassType } from '../../../src/types';

// Re-export types from root
export type {
  ClassListing,
  ClassDetail,
  EnrichedClass,
  GradeRange,
  ClassData,
  DayOfWeek,
  ClassesByDayAndTime,
  ScraperConfig,
  ExportMetadata,
  YAMLOutput
} from '../../../src/types';

// Local types for enrichment-calendar
export type ViewMode = 'day' | 'week';
export type ClassStatus = 'signed_up' | 'considering' | null;

export type Grade = 'P2' | 'P3' | 'P4' | 'K' | '1st' | '2nd' | '3rd' | '4th' | '5th' | '6th' | '7th' | '8th';

export const ALL_GRADES: Grade[] = ['P2', 'P3', 'P4', 'K', '1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th'];

export const GRADE_LABELS: Record<Grade, string> = {
  'P2': 'Pre-K 2',
  'P3': 'Pre-K 3',
  'P4': 'Pre-K 4',
  'K': 'Kindergarten',
  '1st': '1st',
  '2nd': '2nd',
  '3rd': '3rd',
  '4th': '4th',
  '5th': '5th',
  '6th': '6th',
  '7th': '7th',
  '8th': '8th',
};

export interface MinimizedClassesState {
  minimized: Ref<Set<string>>;
  isMinimized: (sessionId: string) => boolean;
  minimize: (sessionId: string) => void;
  restore: (sessionId: string) => void;
  restoreAll: () => void;
  minimizedClasses: ComputedRef<EnrichedClassType[]>;
}
