<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useClasses } from './composables/useClasses';
import { useMinimizedClasses } from './composables/useMinimizedClasses';
import { useScreenshot } from './composables/useScreenshot';
import { useViewState } from './composables/useViewState';
import WeekView from './components/WeekView.vue';
import DayView from './components/DayView.vue';
import ViewToggle from './components/ViewToggle.vue';
import ClassDetail from './components/ClassDetail.vue';
import MinimizedClassesPanel from './components/MinimizedClassesPanel.vue';
import ScreenshotModal from './components/ScreenshotModal.vue';
import type { EnrichedClass } from './types';

const { classes, loading, error, timeSlots, classesByDayAndTime, loadClasses } = useClasses();
const { minimized, minimize, restore, restoreAll, minimizedClasses } = useMinimizedClasses(classes);
const { captureScreenshot } = useScreenshot();
const { viewMode, selectedDay, setViewMode, setDay, nextDay, previousDay } = useViewState();

const minimizedSet = computed(() => minimized.value);

const selectedClass = ref<EnrichedClass | null>(null);
const isModalOpen = ref(false);
const isScreenshotModalOpen = ref(false);
const weekViewContainerRef = ref<HTMLElement | null>(null);

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

function handleScreenshotClick() {
  isScreenshotModalOpen.value = true;
}

function handleScreenshotModalClose() {
  isScreenshotModalOpen.value = false;
}

function handleGenerateScreenshot(kidName: string) {
  captureScreenshot(kidName, weekViewContainerRef.value);
  isScreenshotModalOpen.value = false;
}

onMounted(() => {
  loadClasses();
});
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <header class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
        <h1 class="text-3xl font-bold text-gray-800">
          Enrichment Classes - 3rd Grade
        </h1>
        <button
          v-if="!loading && !error && classes.length > 0"
          @click="handleScreenshotClick"
          class="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
        >
          <span>💾</span>
          <span>Save</span>
        </button>
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

      <div v-else>
        <div ref="weekViewContainerRef">
          <WeekView
            v-show="viewMode === 'week'"
            :time-slots="timeSlots"
            :classes-by-day-and-time="classesByDayAndTime"
            :minimized-session-ids="minimizedSet"
            @class-click="handleClassClick"
            @minimize="handleMinimize"
          />
        </div>

        <DayView
          v-show="viewMode === 'day'"
          :selected-day="selectedDay"
          :time-slots="timeSlots"
          :classes-by-day-and-time="classesByDayAndTime"
          :minimized-session-ids="minimizedSet"
          @class-click="handleClassClick"
          @minimize="handleMinimize"
          @next-day="nextDay"
          @previous-day="previousDay"
        />

        <ViewToggle v-model="viewMode" />
      </div>
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

    <ScreenshotModal
      :is-open="isScreenshotModalOpen"
      @close="handleScreenshotModalClose"
      @generate="handleGenerateScreenshot"
    />
  </div>
</template>
