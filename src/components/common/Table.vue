<!-- src/components/common/Table.vue -->
<template>
  <div class="w-full overflow-hidden rounded-lg shadow-xs">
    <div class="overflow-x-auto rounded-lg shadow">
      <table class="w-full whitespace-nowrap">
        <thead>
          <tr
            class="text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b dark:border-gray-700 bg-gray-50 dark:text-gray-400 dark:bg-gray-800">
            <th class="text-xs sm:text-xs w-[40%] min-w-8 pr-1.5 py-2 sm:pr-3 sm:py-2 ">Product</th>
            <th class="text-xs sm:text-xs w-[15%] min-w-5 px-1.5 py-2 sm:px-3 sm:py-2 text-center">Price</th>
            <th class="text-xs sm:text-xs w-[20%] min-w-8 px-1.5 py-2 sm:px-3 sm:py-2 hidden sm:table-cell text-center">
              Category</th>
            <th class="text-xs sm:text-xs w-[10%] min-w-8 px-1.5 py-2 sm:px-3 sm:py-2 hidden sm:table-cell text-center">
              Stock</th>
            <th class="text-xs sm:text-xs w-[10%] min-w-[90px] px-1.5 py-2 sm:px-3 sm:py-2 text-center">Status</th>
            <th class="text-xs sm:text-xs w-[5%] min-w-[60px] pl-1.5 py-2 sm:pl-3 sm:py-2">Actions</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y dark:divide-gray-700 dark:bg-gray-800">
          <tr v-for="product in products" :key="product.slug"
            class="text-gray-700 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700">
            <td class="pr-1.5 py-2 sm:pr-3 sm:py-2">
              <div class="flex items-center text-xs sm:text-sm">
                <div class="relative hidden w-8 h-8 mr-3 rounded-full sm:block">
                  <div class="w-full h-full rounded-full bg-gray-200 flex items-center justify-center">
                    <span class="text-xs text-gray-500">{{ product.product_name.charAt(0) }}</span>
                  </div>
                  <div class="absolute inset-0 rounded-full shadow-inner" aria-hidden="true"></div>
                </div>
                <div class="min-w-0">
                  <p class="font-semibold truncate">{{ product.product_name }}</p>
                </div>
              </div>
            </td>
            <td class="px-1.5 py-2 sm:px-3 sm:py-2 text-xs sm:text-sm">
              <div class="whitespace-nowrap">
                ${{ product.product_price }}
                <span v-if="product.discount_percentage > 0" class="text-xs text-green-500 ml-1 hidden sm:block">
                  ({{ product.discount_percentage }}% off)
                </span>
              </div>
            </td>
            <td class="px-1.5 py-2 sm:px-3 sm:py-2 text-xs sm:text-sm hidden sm:table-cell">
              <div class="truncate">{{ product.product_category }}</div>
            </td>

            <td class="px-1.5 py-2 sm:px-3 sm:py-2 text-xs sm:text-sm hidden sm:table-cell">
              {{ product.product_quantity }}
            </td>

            <td class="px-1.5 py-2 sm:px-3 sm:py-2 text-xs">
              <span :class="{
              'px-2 py-1 font-semibold leading-tight rounded-full whitespace-nowrap': true,
              'text-green-700 bg-green-100 dark:bg-green-700 dark:text-green-100': product.in_stock,
              'text-red-700 bg-red-100 dark:bg-red-700 dark:text-red-100': !product.in_stock
            }">
                {{ product.in_stock ? 'In Stock' : 'Out of Stock' }}
              </span>
            </td>

            <td class="pl-1.5 py-2 sm:pl-3 sm:py-2 flex justify-end">
              <div class="relative">
                <button
                  class="flex items-center justify-center p-1 text-gray-500 rounded-lg dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 focus:outline-none"
                  aria-label="Actions" @click.stop="toggleDropdown(product.slug)">
                  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z">
                    </path>
                  </svg>
                </button>
                <div v-if="activeDropdown === product.slug"
                  class="absolute right-0 z-10 w-24 mt-2 origin-top-right bg-white rounded-md shadow-lg dark:bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div class="py-1">
                    <button
                      class="block w-full px-4 py-2 text-xs sm:text-sm text-left text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200"
                      @click="emit('edit', product)">
                      Edit
                    </button>
                    <button
                      class="block w-full px-4 py-2 text-xs sm:text-sm text-left text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200"
                      @click="emit('delete', product)">
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    
  </div>
</template>

<script setup lang="ts">
import { Product } from "@/stores/types/product";
import { computed, onBeforeUnmount, onMounted, ref } from "vue";

const props = defineProps({
  products: {
    type: Array as () => Product[],
    required: true,
    default: () => []
  },
});

const emit = defineEmits(['edit', 'delete', 'page-change']);

const activeDropdown = ref<number>(0);

const toggleDropdown = (productId: number) => {
  activeDropdown.value = activeDropdown.value === productId ? -1 : productId;
};

const closeDropdown = () => {
  activeDropdown.value = -1;
};

const handleClickOutside = (event) => {
  if (!event.target.closest('.relative')) {
    closeDropdown();
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>