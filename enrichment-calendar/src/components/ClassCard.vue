<script setup lang="ts">
import type { EnrichedClass } from '../types';

interface Props {
  classData: EnrichedClass;
}

defineProps<Props>();
</script>

<template>
  <div
    class="bg-white border border-gray-200 rounded-lg p-3 cursor-pointer hover:shadow-md hover:border-blue-400 transition-all duration-200 flex-1 min-w-[140px]"
  >
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
