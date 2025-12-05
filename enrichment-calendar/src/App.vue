<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useClasses } from './composables/useClasses';
import { useMinimizedClasses } from './composables/useMinimizedClasses';
import WeekView from './components/WeekView.vue';
import ClassDetail from './components/ClassDetail.vue';
import MinimizedClassesPanel from './components/MinimizedClassesPanel.vue';
import type { EnrichedClass } from './types';

const { classes, loading, error, timeSlots, classesByDayAndTime, loadClasses } = useClasses();
const { minimized, minimize, restore, restoreAll, minimizedClasses } = useMinimizedClasses(classes);

const minimizedSet = computed(() => minimized.value);

const selectedClass = ref<EnrichedClass | null>(null);
const isModalOpen = ref(false);

function handleClassClick(cls: EnrichedClass) {
  selectedClass.value = cls;
  isModalOpen.value = true;
}

function handleModalClose() {
  isModalOpen.value = false;
  selectedClass.value = null;
}

function handleMinimize(sessionId: string) {
  minimize(sessionId);
}

function handleRestore(sessionId: string) {
  restore(sessionId);
}

function handleRestoreAll() {
  restoreAll();
}

onMounted(() => {
  loadClasses();
});
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <header class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 py-6">
        <h1 class="text-3xl font-bold text-gray-800">
          Enrichment Classes - 3rd Grade
        </h1>
      </div>
    </header>

    <main class="max-w-7xl mx-auto px-4 py-8">
      <div v-if="loading" class="text-center py-12">
        <p class="text-gray-600">Loading classes...</p>
      </div>

      <div v-else-if="error" class="text-center py-12">
        <p class="text-red-600">{{ error }}</p>
      </div>

      <div v-else-if="classes.length === 0" class="text-center py-12">
        <p class="text-gray-600">No classes found.</p>
      </div>

      <WeekView
        v-else
        :time-slots="timeSlots"
        :classes-by-day-and-time="classesByDayAndTime"
        :minimized-session-ids="minimizedSet"
        @class-click="handleClassClick"
        @minimize="handleMinimize"
      />
    </main>

    <ClassDetail
      :class-data="selectedClass"
      :is-open="isModalOpen"
      @close="handleModalClose"
    />

    <MinimizedClassesPanel
      :minimized-classes="minimizedClasses"
      @restore="handleRestore"
      @restore-all="handleRestoreAll"
    />
  </div>
</template>
