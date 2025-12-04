<script setup lang="ts">
import { onMounted, onUnmounted, watch } from 'vue';
import type { EnrichedClass } from '../types';

interface Props {
  classData: EnrichedClass | null;
  isOpen: boolean;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  close: []
}>();

function handleClose() {
  emit('close');
}

function handleBackdropClick(event: MouseEvent) {
  if (event.target === event.currentTarget) {
    handleClose();
  }
}

function handleKeyDown(event: KeyboardEvent) {
  if (event.key === 'Escape' && props.isOpen) {
    handleClose();
  }
}

watch(() => props.isOpen, (newValue) => {
  if (newValue) {
    window.addEventListener('keydown', handleKeyDown);
  } else {
    window.removeEventListener('keydown', handleKeyDown);
  }
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown);
});
</script>

<template>
  <Transition name="modal">
    <div
      v-if="isOpen && classData"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      @click="handleBackdropClick"
    >
      <div class="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl">
        <!-- Header -->
        <div class="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-start">
          <h2 class="text-2xl font-bold text-gray-800 pr-8">
            {{ classData.name }}
          </h2>
          <button
            @click="handleClose"
            class="text-gray-400 hover:text-gray-600 text-2xl leading-none"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <!-- Content -->
        <div class="px-6 py-4 space-y-4">
          <!-- Quick Info -->
          <div class="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span class="font-semibold text-gray-700">Day & Time:</span>
              <p class="text-gray-600">{{ classData.dayOfWeek }}, {{ classData.time }}</p>
            </div>
            <div>
              <span class="font-semibold text-gray-700">Instructor:</span>
              <p class="text-gray-600">{{ classData.instructor }}</p>
            </div>
            <div>
              <span class="font-semibold text-gray-700">Grade Levels:</span>
              <p class="text-gray-600">{{ classData.gradeLevels }}</p>
            </div>
            <div>
              <span class="font-semibold text-gray-700">Location:</span>
              <p class="text-gray-600">{{ classData.location }}</p>
            </div>
            <div>
              <span class="font-semibold text-gray-700">Cost:</span>
              <p class="text-gray-600">{{ classData.cost }}</p>
            </div>
            <div>
              <span class="font-semibold text-gray-700">Dates:</span>
              <p class="text-gray-600">{{ classData.startDate }} - {{ classData.endDate }}</p>
            </div>
            <div v-if="classData.numberOfClasses">
              <span class="font-semibold text-gray-700">Number of Classes:</span>
              <p class="text-gray-600">{{ classData.numberOfClasses }}</p>
            </div>
            <div v-if="classData.registrationOpens">
              <span class="font-semibold text-gray-700">Registration Opens:</span>
              <p class="text-gray-600">{{ classData.registrationOpens }}</p>
            </div>
          </div>

          <!-- Instructor Background -->
          <div v-if="classData.instructorBackground">
            <h3 class="font-semibold text-gray-700 mb-2">Instructor Background</h3>
            <p class="text-gray-600 text-sm whitespace-pre-line">{{ classData.instructorBackground }}</p>
          </div>

          <!-- Program Overview -->
          <div v-if="classData.programOverview">
            <h3 class="font-semibold text-gray-700 mb-2">Program Overview</h3>
            <p class="text-gray-600 text-sm whitespace-pre-line">{{ classData.programOverview }}</p>
          </div>

          <!-- Learning Outcomes -->
          <div v-if="classData.learningOutcomes && classData.learningOutcomes.length > 0">
            <h3 class="font-semibold text-gray-700 mb-2">Learning Outcomes</h3>
            <ul class="list-disc list-inside text-gray-600 text-sm space-y-1">
              <li v-for="(outcome, index) in classData.learningOutcomes" :key="index">
                {{ outcome }}
              </li>
            </ul>
          </div>

          <!-- Special Focus -->
          <div v-if="classData.specialFocus && classData.specialFocus.length > 0">
            <h3 class="font-semibold text-gray-700 mb-2">Special Focus</h3>
            <ul class="list-disc list-inside text-gray-600 text-sm space-y-1">
              <li v-for="(focus, index) in classData.specialFocus" :key="index">
                {{ focus }}
              </li>
            </ul>
          </div>

          <!-- Specific Dates -->
          <div v-if="classData.specificDates && classData.specificDates.length > 0">
            <h3 class="font-semibold text-gray-700 mb-2">Class Dates</h3>
            <p class="text-gray-600 text-sm">{{ classData.specificDates.join(', ') }}</p>
          </div>
        </div>

        <!-- Footer -->
        <div class="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4">
          <a
            :href="classData.sessionDetailUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg transition-colors"
          >
            Register on UltraCamp →
          </a>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .bg-white,
.modal-leave-active .bg-white {
  transition: transform 0.2s ease;
}

.modal-enter-from .bg-white,
.modal-leave-to .bg-white {
  transform: scale(0.95);
}
</style>
