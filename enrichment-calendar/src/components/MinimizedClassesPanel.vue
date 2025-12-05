<script setup lang="ts">
import { ref } from 'vue';
import type { EnrichedClass } from '../types';

interface Props {
  minimizedClasses: EnrichedClass[];
}

defineProps<Props>();

defineEmits<{
  restore: [sessionId: string];
  'restore-all': [];
}>();

const isExpanded = ref(false);

const togglePanel = () => {
  isExpanded.value = !isExpanded.value;
};
</script>

<template>
  <div
    v-if="minimizedClasses.length > 0"
    class="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-gray-300 shadow-lg z-50"
  >
    <!-- Header -->
    <div
      class="flex items-center justify-between px-4 py-3 bg-gray-100 cursor-pointer hover:bg-gray-200 transition-colors"
      @click="togglePanel"
    >
      <div class="flex items-center gap-2">
        <span class="font-semibold text-gray-800">
          Minimized Classes
        </span>
        <span class="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-full">
          {{ minimizedClasses.length }}
        </span>
      </div>
      <button class="text-gray-600 hover:text-gray-800 transition-colors">
        <span v-if="isExpanded">▼</span>
        <span v-else>▲</span>
      </button>
    </div>

    <!-- Content -->
    <div
      v-show="isExpanded"
      class="max-h-64 overflow-y-auto p-4"
    >
      <div class="flex justify-between items-center mb-3">
        <p class="text-sm text-gray-600">
          Click restore to bring classes back to the calendar
        </p>
        <button
          @click="$emit('restore-all')"
          class="px-3 py-1 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700 transition-colors"
        >
          Restore All
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        <div
          v-for="cls in minimizedClasses"
          :key="cls.sessionId"
          class="bg-gray-50 border border-gray-200 rounded-lg p-3 flex items-start justify-between"
        >
          <div class="flex-1 min-w-0">
            <h3 class="font-semibold text-sm text-gray-800 mb-1 truncate">
              {{ cls.name }}
            </h3>
            <p class="text-xs text-gray-600 mb-1">
              {{ cls.instructor }}
            </p>
            <p class="text-xs text-gray-500">
              {{ cls.dayOfWeek }} • {{ cls.time }}
            </p>
          </div>
          <button
            @click="$emit('restore', cls.sessionId)"
            class="ml-2 px-2 py-1 bg-green-600 text-white text-xs font-medium rounded hover:bg-green-700 transition-colors whitespace-nowrap"
          >
            Restore
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
