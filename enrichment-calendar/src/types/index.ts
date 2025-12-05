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
export interface MinimizedClassesState {
  minimized: Ref<Set<string>>;
  isMinimized: (sessionId: string) => boolean;
  minimize: (sessionId: string) => void;
  restore: (sessionId: string) => void;
  restoreAll: () => void;
  minimizedClasses: ComputedRef<EnrichedClassType[]>;
}
