import { ref, computed, watch } from 'vue';
import type { Grade } from '../types';

const STORAGE_KEY = 'enrichment-calendar-selected-grades';
const ACTIVE_GRADE_KEY = 'enrichment-calendar-active-grade';

export function useGradeSelection() {
  // Load from localStorage
  const loadSelectedGrades = (): Grade[] => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored) as Grade[];
      }
    } catch (e) {
      console.error('Failed to load grades from localStorage:', e);
    }
    return [];
  };

  const loadActiveGrade = (): Grade | null => {
    try {
      const stored = localStorage.getItem(ACTIVE_GRADE_KEY);
      if (stored) return stored as Grade;
    } catch (e) {
      console.error('Failed to load active grade:', e);
    }
    return null;
  };

  const selectedGrades = ref<Grade[]>(loadSelectedGrades());
  const activeGrade = ref<Grade | null>(loadActiveGrade());

  // Ensure activeGrade is in selectedGrades
  const validatedActiveGrade = computed(() => {
    if (activeGrade.value && selectedGrades.value.includes(activeGrade.value)) {
      return activeGrade.value;
    }
    return selectedGrades.value[0] ?? null;
  });

  // Persist changes
  watch(selectedGrades, (grades) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(grades));
  }, { deep: true });

  watch(activeGrade, (grade) => {
    if (grade) localStorage.setItem(ACTIVE_GRADE_KEY, grade);
  });

  const addGrade = (grade: Grade) => {
    if (!selectedGrades.value.includes(grade)) {
      selectedGrades.value = [...selectedGrades.value, grade];
    }
    activeGrade.value = grade;
  };

  const removeGrade = (grade: Grade) => {
    selectedGrades.value = selectedGrades.value.filter(g => g !== grade);
    if (activeGrade.value === grade) {
      activeGrade.value = selectedGrades.value[0] ?? null;
    }
  };

  const setActiveGrade = (grade: Grade) => {
    if (selectedGrades.value.includes(grade)) {
      activeGrade.value = grade;
    }
  };

  const hasSelectedGrades = computed(() => selectedGrades.value.length > 0);

  return {
    selectedGrades,
    activeGrade: validatedActiveGrade,
    addGrade,
    removeGrade,
    setActiveGrade,
    hasSelectedGrades,
  };
}
