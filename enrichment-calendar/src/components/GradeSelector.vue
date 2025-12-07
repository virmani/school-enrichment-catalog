<script setup lang="ts">
import { ref, computed } from 'vue';
import type { Grade } from '../types';
import { ALL_GRADES, GRADE_LABELS } from '../types';

interface Props {
  selectedGrades: Grade[];
  activeGrade: Grade | null;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  addGrade: [grade: Grade];
  removeGrade: [grade: Grade];
  selectGrade: [grade: Grade];
}>();

const showGradePicker = ref(false);

const availableGrades = computed(() =>
  ALL_GRADES.filter(g => !props.selectedGrades.includes(g))
);

const hasGrades = computed(() => props.selectedGrades.length > 0);

function handleAddGrade(grade: Grade) {
  emit('addGrade', grade);
  showGradePicker.value = false;
}

function toggleGradePicker() {
  showGradePicker.value = !showGradePicker.value;
}
</script>

<template>
  <!-- Empty state: No grades selected -->
  <div v-if="!hasGrades" class="text-center py-12">
    <h2 class="text-xl font-semibold text-gray-700 mb-4">Select a Grade to Get Started</h2>
    <p class="text-gray-500 mb-6">Choose which grade(s) you want to view enrichment classes for</p>
    <div class="flex flex-wrap justify-center gap-2">
      <button
        v-for="grade in ALL_GRADES"
        :key="grade"
        @click="handleAddGrade(grade)"
        class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
      >
        {{ GRADE_LABELS[grade] }}
      </button>
    </div>
  </div>

  <!-- Tab bar: Grades selected -->
  <div v-else class="mb-4">
    <div class="flex items-center gap-2 overflow-x-auto pb-2">
      <!-- Grade tabs -->
      <button
        v-for="grade in selectedGrades"
        :key="grade"
        @click="emit('selectGrade', grade)"
        :class="[
          'flex items-center gap-2 px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors',
          grade === activeGrade
            ? 'bg-blue-600 text-white'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        ]"
      >
        <span>{{ GRADE_LABELS[grade] }}</span>
        <!-- Remove button (only if more than one grade) -->
        <button
          v-if="selectedGrades.length > 1"
          @click.stop="emit('removeGrade', grade)"
          class="ml-1 text-xs opacity-60 hover:opacity-100"
        >
          ×
        </button>
      </button>

      <!-- Add grade button -->
      <button
        v-if="availableGrades.length > 0"
        @click="toggleGradePicker"
        class="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg font-medium transition-colors"
      >
        + Add
      </button>
    </div>

    <!-- Grade picker dropdown -->
    <div
      v-if="showGradePicker && availableGrades.length > 0"
      class="mt-2 p-3 bg-white border rounded-lg shadow-lg"
    >
      <p class="text-sm text-gray-500 mb-2">Add another grade:</p>
      <div class="flex flex-wrap gap-2">
        <button
          v-for="grade in availableGrades"
          :key="grade"
          @click="handleAddGrade(grade)"
          class="px-3 py-1.5 bg-gray-100 hover:bg-blue-100 text-gray-700 hover:text-blue-700 rounded font-medium text-sm transition-colors"
        >
          {{ GRADE_LABELS[grade] }}
        </button>
      </div>
    </div>
  </div>
</template>
