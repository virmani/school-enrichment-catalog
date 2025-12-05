<script setup lang="ts">
import { ref, onUnmounted, watch } from 'vue';

interface Props {
  isOpen: boolean;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  close: [];
  generate: [kidName: string];
}>();

const kidName = ref('');

function handleClose() {
  emit('close');
  kidName.value = '';
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

function handleGenerate() {
  if (kidName.value.trim()) {
    emit('generate', kidName.value.trim());
    kidName.value = '';
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
      v-if="isOpen"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      @click="handleBackdropClick"
    >
      <div class="bg-white rounded-lg max-w-md w-full shadow-xl">
        <!-- Header -->
        <div class="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-start rounded-t-lg">
          <h2 class="text-xl font-bold text-gray-800">
            Take Screenshot
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
          <div>
            <label for="kidName" class="block text-sm font-semibold text-gray-700 mb-2">
              Kid's Name
            </label>
            <input
              id="kidName"
              v-model="kidName"
              type="text"
              placeholder="Enter name..."
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              @keyup.enter="handleGenerate"
            />
          </div>

          <div v-if="kidName.trim()" class="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p class="text-sm text-gray-600">
              Title will be:
            </p>
            <p class="text-base font-semibold text-gray-800 mt-1">
              Enrichment classes plan for {{ kidName.trim() }}
            </p>
          </div>
        </div>

        <!-- Footer -->
        <div class="bg-gray-50 border-t border-gray-200 px-6 py-4 flex gap-3 rounded-b-lg">
          <button
            @click="handleClose"
            class="flex-1 px-4 py-2 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
          <button
            @click="handleGenerate"
            :disabled="!kidName.trim()"
            class="flex-1 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Generate Screenshot
          </button>
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
