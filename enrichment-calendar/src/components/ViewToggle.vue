<script setup lang="ts">
import type { ViewMode } from '../types';

interface Props {
  modelValue: ViewMode;
}

defineProps<Props>();

const emit = defineEmits<{
  'update:modelValue': [value: ViewMode];
}>();

function getButtonClass(mode: ViewMode, currentMode: ViewMode) {
  const baseClasses = 'px-4 py-2 rounded-md font-semibold transition-colors flex-1 sm:flex-none';
  if (mode === currentMode) {
    return `${baseClasses} bg-blue-600 text-white`;
  }
  return `${baseClasses} bg-gray-200 text-gray-700 hover:bg-gray-300`;
}
</script>

<template>
  <div class="flex justify-center mb-6">
    <div class="inline-flex rounded-lg bg-gray-100 p-1 gap-1 w-full sm:w-auto">
      <button
        @click="emit('update:modelValue', 'day')"
        :class="getButtonClass('day', modelValue)"
      >
        <span class="mr-2">📅</span>
        <span>Day View</span>
      </button>
      <button
        @click="emit('update:modelValue', 'week')"
        :class="getButtonClass('week', modelValue)"
      >
        <span class="mr-2">📆</span>
        <span>Week View</span>
      </button>
    </div>
  </div>
</template>
