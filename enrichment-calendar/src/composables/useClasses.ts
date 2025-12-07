import { ref, computed, watch } from 'vue';
import type { Ref } from 'vue';
import { load } from 'js-yaml';
import type { EnrichedClass, ClassData, ClassesByDayAndTime, DayOfWeek, Grade } from '../types';
import { extractUniqueTimeSlots } from '../utils/timeParser';

// Dynamic import map for all grades (Vite requires static paths at build time)
const gradeImports: Record<Grade, () => Promise<string>> = {
  'P2': () => import('../assets/enrichment-P2.yaml?raw').then(m => m.default),
  'P3': () => import('../assets/enrichment-P3.yaml?raw').then(m => m.default),
  'P4': () => import('../assets/enrichment-P4.yaml?raw').then(m => m.default),
  'K': () => import('../assets/enrichment-K.yaml?raw').then(m => m.default),
  '1st': () => import('../assets/enrichment-1st.yaml?raw').then(m => m.default),
  '2nd': () => import('../assets/enrichment-2nd.yaml?raw').then(m => m.default),
  '3rd': () => import('../assets/enrichment-3rd.yaml?raw').then(m => m.default),
  '4th': () => import('../assets/enrichment-4th.yaml?raw').then(m => m.default),
  '5th': () => import('../assets/enrichment-5th.yaml?raw').then(m => m.default),
  '6th': () => import('../assets/enrichment-6th.yaml?raw').then(m => m.default),
  '7th': () => import('../assets/enrichment-7th.yaml?raw').then(m => m.default),
  '8th': () => import('../assets/enrichment-8th.yaml?raw').then(m => m.default),
};

export function useClasses(gradeRef: Ref<Grade | null>) {
  const classes = ref<EnrichedClass[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const timeSlots = computed(() => extractUniqueTimeSlots(classes.value));

  const classesByDayAndTime = computed<ClassesByDayAndTime>(() => {
    const result: ClassesByDayAndTime = {};
    const days: DayOfWeek[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

    classes.value.forEach(cls => {
      if (!result[cls.time]) {
        result[cls.time] = {
          Monday: [],
          Tuesday: [],
          Wednesday: [],
          Thursday: [],
          Friday: []
        };
      }

      if (days.includes(cls.dayOfWeek as DayOfWeek)) {
        result[cls.time]![cls.dayOfWeek as DayOfWeek].push(cls);
      }
    });

    return result;
  });

  async function loadClasses() {
    const grade = gradeRef.value;
    if (!grade) {
      classes.value = [];
      loading.value = false;
      error.value = null;
      return;
    }

    try {
      loading.value = true;
      error.value = null;

      const importFn = gradeImports[grade];
      if (!importFn) {
        throw new Error(`No data file for grade: ${grade}`);
      }

      const yamlRaw = await importFn();
      const data = load(yamlRaw) as ClassData;
      classes.value = data.classes;
    } catch (e) {
      error.value = `Failed to load class data for grade ${grade}`;
      console.error('Error loading classes:', e);
      classes.value = [];
    } finally {
      loading.value = false;
    }
  }

  // Auto-reload when grade changes
  watch(gradeRef, () => {
    loadClasses();
  }, { immediate: true });

  return {
    classes,
    loading,
    error,
    timeSlots,
    classesByDayAndTime,
    loadClasses
  };
}
