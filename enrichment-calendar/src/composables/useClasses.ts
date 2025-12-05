import { ref, computed } from 'vue';
import { load } from 'js-yaml';
import type { EnrichedClass, ClassData, ClassesByDayAndTime, DayOfWeek } from '../types';
import { extractUniqueTimeSlots } from '../utils/timeParser';
import classDataYaml from '../assets/enrichment-3rd.yaml?raw';

export function useClasses() {
  const classes = ref<EnrichedClass[]>([]);
  const loading = ref(true);
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
    try {
      loading.value = true;
      const data = load(classDataYaml) as ClassData;
      classes.value = data.classes;
      error.value = null;
    } catch (e) {
      error.value = 'Failed to load class data';
      console.error('Error loading classes:', e);
    } finally {
      loading.value = false;
    }
  }

  return {
    classes,
    loading,
    error,
    timeSlots,
    classesByDayAndTime,
    loadClasses
  };
}
