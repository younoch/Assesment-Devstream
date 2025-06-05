<template>
  <Transition name="delete-fade">
    <div
      v-if="isOpen"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      @click.self="closeModal"
    >
      <div class="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
        <div class="flex flex-col space-y-4">
          <div class="flex justify-between items-center">
            <h3 class="text-lg font-medium text-gray-900">
              Confirm Deletion
            </h3>
            <button
              @click="closeModal"
              class="text-gray-400 hover:text-gray-500"
            >
              <span class="sr-only">Close</span>
              <svg
                class="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div class="mt-2">
            <p class="text-sm text-gray-500">
              Are you sure you want to delete <span class="font-bold">{{ product.product_name }}</span>? This action cannot be undone.
            </p>
          </div>

          <div class="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              @click="closeModal"
              class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancel
            </button>
            <button
              type="button"
              @click="confirmDelete"
              class="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { Product } from "@/stores/types";

const props = defineProps({
  product: {
    type: Object as () => Product,
    required: true,
    default: () => []
  },
  isOpen: {
    type: Boolean,
    required: true,
    default: () => false
  },
});

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'confirm', slug: string): void;
}>();

const closeModal = () => {
  emit('close');
};

const confirmDelete = () => {
  emit('confirm', props.product.slug);
  closeModal();
};
</script>

<style scoped>
.delete-fade-enter-active,
.delete-fade-leave-active {
  transition: opacity 0.3s ease;
}

.delete-fade-enter-from,
.delete-fade-leave-to {
  opacity: 0;
}
</style>