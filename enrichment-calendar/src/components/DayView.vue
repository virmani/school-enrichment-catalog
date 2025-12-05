<script setup lang="ts">
import type { EnrichedClass, ClassesByDayAndTime, DayOfWeek } from '../types';
import ClassCard from './ClassCard.vue';

interface Props {
  selectedDay: DayOfWeek;
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
  nextDay: [];
  previousDay: [];
}>();

const dayColors: Record<DayOfWeek, string> = {
  Monday: 'bg-blue-50',
  Tuesday: 'bg-green-50',
  Wednesday: 'bg-yellow-50',
  Thursday: 'bg-purple-50',
  Friday: 'bg-pink-50'
};

function getClassesForTime(timeSlot: string): EnrichedClass[] {
  const classes = props.classesByDayAndTime[timeSlot]?.[props.selectedDay] || [];
  return classes.filter(cls => !props.minimizedSessionIds?.has(cls.sessionId));
}

function handleClassClick(cls: EnrichedClass) {
  emit('classClick', cls);
}

function getDayColor(): string {
  return dayColors[props.selectedDay];
}

function hasVisibleClasses(timeSlot: string): boolean {
  return getClassesForTime(timeSlot).length > 0;
}

const visibleTimeSlots = () => {
  return props.timeSlots.filter(hasVisibleClasses);
};

const hasAnyClasses = () => {
  return visibleTimeSlots().length > 0;
};
</script>

<template>
  <div class="w-full max-w-2xl mx-auto">
    <!-- Day navigation header -->
    <div class="mb-6 flex items-center justify-between bg-white rounded-lg shadow-sm p-4">
      <button
        @click="emit('previousDay')"
        class="p-2 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        aria-label="Previous day"
      >
        <span class="text-2xl">←</span>
      </button>

      <h2 class="text-2xl font-bold text-gray-800">
        {{ selectedDay }}
      </h2>

      <button
        @click="emit('nextDay')"
        class="p-2 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        aria-label="Next day"
      >
        <span class="text-2xl">→</span>
      </button>
    </div>

    <!-- Empty state -->
    <div v-if="!hasAnyClasses()" class="text-center py-12 bg-white rounded-lg shadow-sm">
      <p class="text-gray-600">No classes scheduled for {{ selectedDay }}</p>
    </div>

    <!-- Time slots for selected day -->
    <div v-else class="space-y-4">
      <div
        v-for="timeSlot in visibleTimeSlots()"
        :key="timeSlot"
        class="bg-white rounded-lg shadow-sm overflow-hidden"
      >
        <!-- Time label -->
        <div class="bg-gray-100 border-b border-gray-200 px-4 py-3">
          <p class="text-sm font-semibold text-gray-700">
            {{ timeSlot }}
          </p>
        </div>

        <!-- Classes container -->
        <div
          :class="[getDayColor(), 'p-4 space-y-3']"
        >
          <div
            v-for="cls in getClassesForTime(timeSlot)"
            :key="cls.sessionId"
            @click="handleClassClick(cls)"
          >
            <ClassCard
              :class-data="cls"
              @minimize="emit('minimize', $event)"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
