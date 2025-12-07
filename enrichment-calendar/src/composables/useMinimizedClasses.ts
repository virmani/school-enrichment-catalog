import { ref, computed, watch } from 'vue';
import type { Ref, ComputedRef } from 'vue';
import type { EnrichedClass, MinimizedClassesState, Grade } from '../types';

const STORAGE_PREFIX = 'enrichment-calendar-minimized-classes';

function getStorageKey(grade: Grade | null): string {
  return grade ? `${STORAGE_PREFIX}-${grade}` : STORAGE_PREFIX;
}

export function useMinimizedClasses(
  allClasses: Ref<EnrichedClass[]>,
  gradeRef: Ref<Grade | null>
): MinimizedClassesState {
  // Initialize Set from localStorage
  const loadMinimizedFromStorage = (grade: Grade | null): Set<string> => {
    try {
      const stored = localStorage.getItem(getStorageKey(grade));
      if (stored) {
        const parsed = JSON.parse(stored);
        return new Set(Array.isArray(parsed) ? parsed : []);
      }
    } catch (error) {
      console.error('Failed to load minimized classes from localStorage:', error);
    }
    return new Set();
  };

  // Save Set to localStorage
  const saveMinimizedToStorage = (minimizedSet: Set<string>, grade: Grade | null) => {
    try {
      localStorage.setItem(getStorageKey(grade), JSON.stringify(Array.from(minimizedSet)));
    } catch (error) {
      console.error('Failed to save minimized classes to localStorage:', error);
    }
  };

  // Reactive minimized Set
  const minimized = ref<Set<string>>(loadMinimizedFromStorage(gradeRef.value));

  // Reload when grade changes
  watch(gradeRef, (newGrade) => {
    minimized.value = loadMinimizedFromStorage(newGrade);
  });

  // Watch for changes and persist
  watch(minimized, (newSet) => {
    saveMinimizedToStorage(newSet, gradeRef.value);
  }, { deep: true });

  // Check if a class is minimized
  const isMinimized = (sessionId: string): boolean => {
    return minimized.value.has(sessionId);
  };

  // Minimize a class
  const minimize = (sessionId: string): void => {
    const newSet = new Set(minimized.value);
    newSet.add(sessionId);
    minimized.value = newSet;
  };

  // Restore a class
  const restore = (sessionId: string): void => {
    const newSet = new Set(minimized.value);
    newSet.delete(sessionId);
    minimized.value = newSet;
  };

  // Restore all classes
  const restoreAll = (): void => {
    minimized.value = new Set();
  };

  // Get full EnrichedClass objects for minimized classes
  const minimizedClasses: ComputedRef<EnrichedClass[]> = computed(() => {
    return allClasses.value.filter(cls => minimized.value.has(cls.sessionId));
  });

  return {
    minimized,
    isMinimized,
    minimize,
    restore,
    restoreAll,
    minimizedClasses,
  };
}
