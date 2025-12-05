<script setup lang="ts">
import type { EnrichedClass } from '../types';

interface Props {
  classData: EnrichedClass;
}

defineProps<Props>();

defineEmits<{
  minimize: [sessionId: string];
}>();
</script>

<template>
  <div
    class="relative group bg-white border border-gray-200 rounded-lg p-3 cursor-pointer hover:shadow-md hover:border-blue-400 transition-all duration-200 flex-1 min-w-[140px]"
  >
    <button
      @click.stop="$emit('minimize', classData.sessionId)"
      class="absolute top-1 right-1 w-5 h-5 flex items-center justify-center rounded bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-800 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity text-sm font-bold"
      title="Minimize this class"
    >
      −
    </button>
    <h3 class="font-semibold text-sm text-gray-800 mb-1 line-clamp-2">
      {{ classData.name }}
    </h3>
    <p class="text-xs text-gray-600 mb-1">
      {{ classData.instructor }}
    </p>
    <p class="text-xs font-medium text-blue-600">
      {{ classData.cost }}
    </p>
  </div>
</template>
