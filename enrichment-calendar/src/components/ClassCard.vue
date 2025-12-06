<script setup lang="ts">
import type { EnrichedClass, ClassStatus } from '../types';

interface Props {
  classData: EnrichedClass;
  status?: ClassStatus;
}

withDefaults(defineProps<Props>(), {
  status: null
});

defineEmits<{
  minimize: [sessionId: string];
  toggleStatus: [sessionId: string, targetStatus: 'signed_up' | 'considering'];
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

    <!-- Status Toggle Buttons -->
    <div class="mt-2 flex gap-1.5">
      <button
        @click.stop="$emit('toggleStatus', classData.sessionId, 'signed_up')"
        :class="[
          'flex-1 text-[10px] font-semibold px-2 py-1 rounded border transition-colors',
          status === 'signed_up'
            ? 'bg-green-500 border-green-600 text-white'
            : 'bg-white border-gray-300 text-gray-700 hover:bg-green-50 hover:border-green-400'
        ]"
        :title="status === 'signed_up' ? 'Remove signed up status' : 'Mark as signed up'"
        :aria-pressed="status === 'signed_up'"
      >
        ✓ Sign Up
      </button>

      <button
        @click.stop="$emit('toggleStatus', classData.sessionId, 'considering')"
        :class="[
          'flex-1 text-[10px] font-semibold px-2 py-1 rounded border transition-colors',
          status === 'considering'
            ? 'bg-amber-500 border-amber-600 text-white'
            : 'bg-white border-gray-300 text-gray-700 hover:bg-amber-50 hover:border-amber-400'
        ]"
        :title="status === 'considering' ? 'Remove considering status' : 'Mark as considering'"
        :aria-pressed="status === 'considering'"
      >
        ★ Maybe
      </button>
    </div>
  </div>
</template>
