<template>
  <div class="flex items-center">
    <input
      :id="id"
      type="checkbox"
      :checked="modelValue"
      @change="$emit('update:modelValue', $event.target.checked)"
      class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
    />
    <label :for="id" class="ml-2 block text-sm text-gray-700">
      {{ label }}
    </label>
  </div>
</template>

<script setup lang="ts">
defineProps({
  id: String,
  label: String,
  modelValue: Boolean,
});

defineEmits(['update:modelValue']);
</script>