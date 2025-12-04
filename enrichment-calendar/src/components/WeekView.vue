<script setup lang="ts">
import { computed } from 'vue';
import type { EnrichedClass, ClassesByDayAndTime, DayOfWeek } from '../types';
import ClassCard from './ClassCard.vue';

interface Props {
  timeSlots: string[];
  classesByDayAndTime: ClassesByDayAndTime;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  classClick: [cls: EnrichedClass]
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
  return props.classesByDayAndTime[time]?.[day] || [];
}

function handleClassClick(cls: EnrichedClass) {
  emit('classClick', cls);
}

function getDayColor(day: DayOfWeek): string {
  return dayColors[day];
}
</script>

<template>
  <div class="w-full overflow-x-auto">
    <div class="min-w-[800px]">
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
      <div
        v-for="(timeSlot, index) in timeSlots"
        :key="timeSlot"
      >
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
              />
            </div>
          </div>
        </div>

        <!-- Horizontal line after each time block -->
        <div v-if="index < timeSlots.length - 1" class="border-b border-gray-300 my-2"></div>
      </div>
    </div>
  </div>
</template>
