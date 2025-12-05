import { ref, watch, onMounted, onUnmounted, type Ref } from 'vue';
import type { DayOfWeek } from '../types';

export type ViewMode = 'day' | 'week';

const DAYS: DayOfWeek[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const STORAGE_KEY_SELECTED_DAY = 'enrichment-calendar-selected-day';

export function useViewState() {
  const viewMode: Ref<ViewMode> = ref('week');
  const selectedDay: Ref<DayOfWeek> = ref('Monday');
  const isLargeScreen = ref(true);

  let mediaQuery: MediaQueryList | null = null;

  function initializeFromStorage() {
    try {
      const storedDay = localStorage.getItem(STORAGE_KEY_SELECTED_DAY);
      if (storedDay && DAYS.includes(storedDay as DayOfWeek)) {
        selectedDay.value = storedDay as DayOfWeek;
      }
    } catch (error) {
      console.warn('Failed to read from localStorage:', error);
    }
  }

  function initializeMediaQuery() {
    if (typeof window === 'undefined') return;

    mediaQuery = window.matchMedia('(min-width: 1024px)');
    isLargeScreen.value = mediaQuery.matches;
    viewMode.value = isLargeScreen.value ? 'week' : 'day';

    const handleChange = (e: MediaQueryListEvent) => {
      isLargeScreen.value = e.matches;
      viewMode.value = isLargeScreen.value ? 'week' : 'day';
    };

    mediaQuery.addEventListener('change', handleChange);

    onUnmounted(() => {
      mediaQuery?.removeEventListener('change', handleChange);
    });
  }

  function setViewMode(mode: ViewMode) {
    viewMode.value = mode;
  }

  function setDay(day: DayOfWeek) {
    selectedDay.value = day;
  }

  function nextDay() {
    const currentIndex = DAYS.indexOf(selectedDay.value);
    const nextIndex = (currentIndex + 1) % DAYS.length;
    selectedDay.value = DAYS[nextIndex]!;
  }

  function previousDay() {
    const currentIndex = DAYS.indexOf(selectedDay.value);
    const prevIndex = (currentIndex - 1 + DAYS.length) % DAYS.length;
    selectedDay.value = DAYS[prevIndex]!;
  }

  const canGoNext = () => {
    return true; // Always can go next in circular mode
  };

  const canGoPrevious = () => {
    return true; // Always can go previous in circular mode
  };

  // Persist selected day to localStorage
  watch(selectedDay, (newDay) => {
    try {
      localStorage.setItem(STORAGE_KEY_SELECTED_DAY, newDay);
    } catch (error) {
      console.warn('Failed to write to localStorage:', error);
    }
  });

  onMounted(() => {
    initializeFromStorage();
    initializeMediaQuery();
  });

  return {
    viewMode,
    selectedDay,
    isLargeScreen,
    setViewMode,
    setDay,
    nextDay,
    previousDay,
    canGoNext,
    canGoPrevious,
  };
}
