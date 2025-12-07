import { ref, watch } from 'vue';
import type { Ref } from 'vue';
import type { ClassStatus, Grade } from '../types';

const STORAGE_PREFIX = 'enrichment-calendar-class-status';

function getStorageKey(grade: Grade | null): string {
  return grade ? `${STORAGE_PREFIX}-${grade}` : STORAGE_PREFIX;
}

export function useClassStatus(gradeRef: Ref<Grade | null>) {
  // Load from localStorage
  const loadFromStorage = (grade: Grade | null): Map<string, ClassStatus> => {
    try {
      const stored = localStorage.getItem(getStorageKey(grade));
      if (stored) {
        const obj = JSON.parse(stored);
        return new Map(Object.entries(obj));
      }
    } catch (error) {
      console.error('Failed to load class status from localStorage:', error);
    }
    return new Map();
  };

  // Save to localStorage
  const saveToStorage = (statusMap: Map<string, ClassStatus>, grade: Grade | null) => {
    try {
      const obj = Object.fromEntries(statusMap);
      localStorage.setItem(getStorageKey(grade), JSON.stringify(obj));
    } catch (error) {
      console.error('Failed to save class status to localStorage:', error);
    }
  };

  const statuses = ref<Map<string, ClassStatus>>(loadFromStorage(gradeRef.value));

  // Reload when grade changes
  watch(gradeRef, (newGrade) => {
    statuses.value = loadFromStorage(newGrade);
  });

  // Auto-persist on changes
  watch(statuses, (newMap) => {
    saveToStorage(newMap, gradeRef.value);
  }, { deep: true });

  const getStatus = (sessionId: string): ClassStatus => {
    return statuses.value.get(sessionId) || null;
  };

  const toggleStatus = (sessionId: string, targetStatus: 'signed_up' | 'considering') => {
    const newMap = new Map(statuses.value);
    const current = newMap.get(sessionId) || null;

    if (current === targetStatus) {
      newMap.delete(sessionId); // Toggle off
    } else {
      newMap.set(sessionId, targetStatus); // Set new status (mutually exclusive)
    }

    statuses.value = newMap;
  };

  return {
    statuses,
    getStatus,
    toggleStatus,
  };
}
