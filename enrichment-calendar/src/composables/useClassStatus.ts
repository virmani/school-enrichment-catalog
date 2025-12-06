import { ref, watch } from 'vue';
import type { Ref } from 'vue';
import type { ClassStatus } from '../types';

const STORAGE_KEY = 'enrichment-calendar-class-status';

export function useClassStatus() {
  // Load from localStorage
  const loadFromStorage = (): Map<string, ClassStatus> => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
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
  const saveToStorage = (statusMap: Map<string, ClassStatus>) => {
    try {
      const obj = Object.fromEntries(statusMap);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(obj));
    } catch (error) {
      console.error('Failed to save class status to localStorage:', error);
    }
  };

  const statuses = ref<Map<string, ClassStatus>>(loadFromStorage());

  // Auto-persist on changes
  watch(statuses, (newMap) => {
    saveToStorage(newMap);
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
