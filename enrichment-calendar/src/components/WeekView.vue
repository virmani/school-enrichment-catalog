<script setup lang="ts">
import type { EnrichedClass, ClassesByDayAndTime, DayOfWeek } from '../types';
import ClassCard from './ClassCard.vue';

interface Props {
  timeSlots: string[];
  classesByDayAndTime: ClassesByDayAndTime;
  minimizedSessionIds?: Set<string>;
}

const props = withDefaults(defineProps<Props>(), {
  minimizedSessionIds: () => new Set()
});

const emit = defineEmits<{
  classClick: [cls: EnrichedClass];
  minimize: [sessionId: string];
}>();

const days: DayOfWeek[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

const dayColors: Record<DayOfWeek, string> = {
  Monday: 'bg-blue-50',
  Tuesday: 'bg-green-50',
  Wednesday: 'bg-yellow-50',
  Thursday: 'bg-purple-50',
  Friday: 'bg-pink-50'
};

function getClassesForTimeAndDay(time: string, day: DayOfWeek): EnrichedClass[] {
  const classes = props.classesByDayAndTime[time]?.[day] || [];
  return classes.filter(cls => !props.minimizedSessionIds?.has(cls.sessionId));
}

function handleClassClick(cls: EnrichedClass) {
  emit('classClick', cls);
}

function getDayColor(day: DayOfWeek): string {
  return dayColors[day];
}

function hasVisibleClasses(timeSlot: string): boolean {
  // Check if any day in this time slot has non-minimized classes
  return days.some(day => getClassesForTimeAndDay(timeSlot, day).length > 0);
}
</script>

<template>
  <div class="w-full overflow-x-auto">
    <div class="min-w-0 lg:min-w-[800px]">
      <!-- Header row with day names -->
      <div class="grid grid-cols-6 gap-2 mb-4 bg-gray-100 py-3 px-2 rounded-lg shadow-sm">
        <div class="font-bold text-sm text-gray-500"></div>
        <div
          v-for="day in days"
          :key="day"
          class="font-bold text-center text-sm text-gray-800 uppercase tracking-wide"
        >
          {{ day }}
        </div>
      </div>

      <!-- Time slot rows -->
      <template
        v-for="(timeSlot, index) in timeSlots"
        :key="timeSlot"
      >
        <div v-if="hasVisibleClasses(timeSlot)">
          <div class="grid grid-cols-6 gap-2">
            <!-- Time label -->
            <div class="text-sm font-semibold text-gray-700 py-3 px-3 bg-gray-50 rounded-md border-l-4 border-gray-400 flex items-center">
              {{ timeSlot }}
            </div>

            <!-- Day columns -->
            <div
              v-for="day in days"
              :key="`${timeSlot}-${day}`"
              :class="[getDayColor(day), 'min-h-[100px] p-2 rounded-sm border border-gray-200']"
            >
              <div
                v-if="getClassesForTimeAndDay(timeSlot, day).length > 0"
                class="flex gap-2 flex-wrap"
              >
                <ClassCard
                  v-for="cls in getClassesForTimeAndDay(timeSlot, day)"
                  :key="cls.sessionId"
                  :class-data="cls"
                  @click="handleClassClick(cls)"
                  @minimize="emit('minimize', $event)"
                />
              </div>
            </div>
          </div>

          <!-- Horizontal line after each time block -->
          <div v-if="index < timeSlots.length - 1" class="border-b border-gray-300 my-2"></div>
        </div>
      </template>
    </div>
  </div>
</template>
