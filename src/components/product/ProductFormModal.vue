<template>
  <Transition name="create-fade">
    <div
      v-if="isOpen"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      @click.self="closeModal"
    >
      <div class="bg-white rounded-lg shadow-xl p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div class="flex flex-col space-y-4">
          <div class="flex justify-between items-center sticky top-0 bg-white py-2">
            <h3 class="text-lg font-medium text-gray-900">
              {{ isEditMode ? 'Update Product' : 'Create Product' }}
            </h3>
            <button
              @click="closeModal"
              class="text-gray-400 hover:text-gray-500"
            >
              <span class="sr-only">Close</span>
              <span class="h-6 w-6"> X</span>
            </button>
          </div>

          <form @submit.prevent="handleSubmit" class="divide-y divide-gray-200">
            <!-- Basic Information Section -->
            <div class="py-4">
              <h4 class="text-md font-medium text-gray-900 mb-4">Basic Information</h4>
              <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormInput
                  label="Product Name *"
                  id="product_name"
                  v-model="formData.product_name"
                  type="text"
                  required
                />

                <FormInput
                  label="SKU *"
                  id="sku"
                  v-model="formData.sku"
                  type="text"
                  readonly
                />

                <div class="sm:col-span-2">
                  <label for="product_description" class="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    id="product_description"
                    v-model="formData.product_description"
                    rows="3"
                    class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  ></textarea>
                </div>
              </div>
            </div>

            <!-- Pricing & Inventory Section -->
            <div class="py-4">
              <h4 class="text-md font-medium text-gray-900 mb-4">Pricing & Inventory</h4>
              <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <FormInput
                  label="Price *"
                  id="product_price"
                  v-model.number="formData.product_price"
                  type="number"
                  min="0"
                  step="0.01"
                  required
                />

                <FormInput
                  label="Quantity *"
                  id="product_quantity"
                  v-model.number="formData.product_quantity"
                  type="number"
                  min="0"
                  step="1"
                  required
                />

                <FormInput
                  label="Discount (%)"
                  id="discount_percentage"
                  v-model.number="formData.discount_percentage"
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                />
              </div>
            </div>

            <!-- Category & Brand Section -->
            <div class="py-4">
              <h4 class="text-md font-medium text-gray-900 mb-4">Category & Brand</h4>
              <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormInput
                  label="Category *"
                  id="product_category"
                  v-model="formData.product_category"
                  type="text"
                  required
                />

                <FormInput
                  label="Brand"
                  id="product_brand"
                  v-model="formData.product_brand"
                  type="text"
                />
              </div>
            </div>

            <!-- Additional Information Section -->
            <div class="py-4">
              <h4 class="text-md font-medium text-gray-900 mb-4">Additional Information</h4>
              <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <FormInput
                  label="Rating"
                  id="rating"
                  v-model.number="formData.rating"
                  type="number"
                  min="0"
                  max="5"
                  step="0.1"
                />

                <FormInput
                  label="Shipping Weight (kg)"
                  id="shipping_weight"
                  v-model.number="formData.shipping_weight"
                  type="number"
                  min="0"
                  step="0.01"
                />

                <div class="flex items-end space-x-4">
                  <FormCheckbox
                    id="in_stock"
                    label="In Stock"
                    v-model="formData.in_stock"
                  />

                  <FormCheckbox
                    id="is_featured"
                    label="Featured Product"
                    v-model="formData.is_featured"
                  />
                </div>
              </div>
            </div>

            <div class="flex justify-end space-x-3 pt-6">
              <button
                type="button"
                @click="closeModal"
                class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                {{ isEditMode ? 'Update Product' : 'Create Product' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import type { Product } from '@/stores/types';
import FormInput from '@/components/common/FormInput.vue';
import FormCheckbox from '@/components/common/FormCheckbox.vue';
import { generateRandomSKU } from '@/utils/skuGenerator';

type CreateProduct = Omit<Product, 'id' | 'created_at' | 'updated_at' | 'slug'> & {
  sku?: string; 
};

type UpdateProduct = Partial<Omit<Product, 'created_at' | 'sku'>> & {
  slug: string; 
  updated_at?: string;
};

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true,
  },
  product: {
    type: Object as () => Product,
    default: () => ({}),
  },
  isEditMode: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'submit', product: CreateProduct | UpdateProduct): void;
}>();

const initialFormData: Product = {
  id: undefined,
  product_name: '',
  product_description: '',
  product_price: 0,
  product_quantity: 0,
  product_category: '',
  product_brand: '',
  rating: 0,
  in_stock: true,
  sku: '',
  discount_percentage: 0,
  is_featured: false,
  shipping_weight: 0,
  slug: '',
  created_at: '',
  updated_at: '',
};

const formData = ref<Product>({ ...initialFormData });


watch(() => props.isOpen, (isOpen) => {
  if (isOpen && props.isEditMode) {

    formData.value = { 
      ...initialFormData, 
      ...JSON.parse(JSON.stringify(props.product)) 
    };
  } else if (!isOpen) {
    resetForm();
  }
});

const resetForm = () => {
  formData.value = { ...initialFormData };
};

const closeModal = () => {
  emit('close');
};

const handleSubmit = () => {
  try {
    const processedData: Product = {
      ...formData.value,
      product_price: Number(formData.value.product_price) || 0,
      product_quantity: Number(formData.value.product_quantity) || 0,
      discount_percentage: Number(formData.value.discount_percentage) || 0,
      shipping_weight: Number(formData.value.shipping_weight) || 0,
      rating: Math.min(Math.max(Number(formData.value.rating) || 0, 5)),
    };

    if (!props.isEditMode) {

      const { id, created_at, updated_at, slug, ...createData } = processedData;
      
      const dataToSubmit: CreateProduct = {
        ...createData,
        sku: createData.sku || generateRandomSKU(),
      };
      
      emit('submit', dataToSubmit);
    } else {
      if (!processedData.slug) {
        throw new Error('Product slug is required for update');
      }
      
      const { created_at, sku, ...updateData } = processedData;
      const dataToSubmit: UpdateProduct = {
        ...updateData,
        slug: processedData.slug,
        updated_at: new Date().toISOString(),
      };
      
      emit('submit', dataToSubmit);
    }
  } catch (error) {
    console.error('Form submission error:', error);
    throw error;
  }
};

</script>

<style scoped>
.create-fade-enter-active,
.create-fade-leave-active {
  transition: opacity 0.3s ease;
}

.create-fade-enter-from,
.create-fade-leave-to {
  opacity: 0;
}
</style>