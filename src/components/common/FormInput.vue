<template>
  <div>
    <label :for="id" class="block text-sm font-medium text-gray-700">
      {{ label }}
    </label>
    <input
      :id="id"
      :type="type"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      :min="min"
      :max="max"
      :step="step"
      :required="required"
      :readonly="readonly"
      class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
    />
  </div>
</template>

<script setup lang="ts">
defineProps({
  id: String,
  label: String,
  modelValue: [String, Number],
  type: {
    type: String,
    default: 'text',
  },
  min: [String, Number],
  max: [String, Number],
  step: [String, Number],
  required: Boolean,
  readonly: Boolean,
});

defineEmits(['update:modelValue']);
</script>