<template>
    <div v-if="pagination"
      class="grid px-3 py-2 text-xs font-semibold tracking-wide text-gray-500 uppercase border-t dark:border-gray-700 bg-gray-50 sm:grid-cols-9 dark:text-gray-400 dark:bg-gray-800">
      <span class="flex items-center col-span-3">
        Showing {{ pagination.per_page * (pagination.current_page - 1) + 1 }}-{{
        Math.min(pagination.per_page * pagination.current_page, pagination.total_items)
        }} of {{ pagination.total_items }}
      </span>
      <span class="flex items-center col-span-2">
        <span class="mr-2">Items per page:</span>
        <select 
          v-model="pagination.per_page" 
          @change="onPerPageChange"
          class="px-2 py-1 text-xs border rounded-md dark:bg-gray-800 dark:border-gray-700 focus:outline-none focus:border-purple-400"
        >
          <option v-for="option in perPageOptions" :value="option" :key="option">
            {{ option }}
          </option>
        </select>
      </span>
      <span class="flex col-span-4 mt-2 sm:mt-auto sm:justify-end">
        <nav aria-label="Table navigation">
          <ul class="inline-flex items-center">
            <li>
              <button 
                class="px-3 py-1 rounded-md rounded-l-lg focus:outline-none focus:shadow-outline-purple"
                aria-label="Previous" 
                @click="goToPrevPage"
                :disabled="pagination.current_page === 1"
                :class="{'opacity-50 cursor-not-allowed': pagination.current_page === 1}"
              >
                <svg class="w-4 h-4 fill-current" aria-hidden="true" viewBox="0 0 20 20">
                  <path
                    d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                    clip-rule="evenodd" fill-rule="evenodd"></path>
                </svg>
              </button>
            </li>
            <li v-for="page in visiblePages" :key="page">
              <button 
                v-if="page !== '...'"
                class="px-3 py-1 rounded-md focus:outline-none focus:shadow-outline-purple" 
                :class="{
                  'text-white bg-purple-600 border border-r-0 border-purple-600': page === pagination.current_page,
                  'hover:bg-gray-100 dark:hover:bg-gray-700': page !== pagination.current_page
                }" 
                @click="goToPage(page)"
              >
                {{ page }}
              </button>
              <span 
                v-else
                class="px-3 py-1"
              >
                {{ page }}
              </span>
            </li>
            <li>
              <button 
                class="px-3 py-1 rounded-md rounded-r-lg focus:outline-none focus:shadow-outline-purple"
                aria-label="Next" 
                @click="goToNextPage"
                :disabled="pagination.current_page === pagination.total_pages"
                :class="{'opacity-50 cursor-not-allowed': pagination.current_page === pagination.total_pages}"
              >
                <svg class="w-4 h-4 fill-current" aria-hidden="true" viewBox="0 0 20 20">
                  <path
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clip-rule="evenodd" fill-rule="evenodd"></path>
                </svg>
              </button>
            </li>
          </ul>
        </nav>
      </span>
    </div>
</template>

<script setup lang="ts">
import { Pagination } from "@/stores/types";
import { computed } from "vue";

const props = defineProps({
  pagination: {
    type: Object as () => Pagination,
    required: true
  }
});

const emit = defineEmits(['page-change', 'per-page-change']);

const perPageOptions = [5, 10, 20, 30];

const goToPage = (page: number) => {
  if (page >= 1 && page <= props.pagination?.total_pages) {
    emit('page-change', page);
  }
};

const goToPrevPage = () => {
  if (props.pagination?.current_page > 1) {
    emit('page-change', props.pagination.current_page - 1);
  }
};

const goToNextPage = () => {
  if (props.pagination && props.pagination.current_page < props.pagination.total_pages) {
    emit('page-change', props.pagination.current_page + 1);
  }
};

const onPerPageChange = () => {
  emit('per-page-change', props.pagination.per_page);
};

const visiblePages = computed(() => {
  if (!props.pagination) return [];
  
  const current = props.pagination.current_page;
  const total = props.pagination.total_pages;
  const range = [];
  
  range.push(1);

  const start = Math.max(2, current - 2);
  const end = Math.min(total - 1, current + 2);
  
  if (start > 2) range.push('...');
  
  for (let i = start; i <= end; i++) {
    range.push(i);
  }
  
  if (end < total - 1) range.push('...');

  if (total > 1 && !range.includes(total)) range.push(total);
  
  return range;
});
</script>