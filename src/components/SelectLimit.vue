<script setup lang="ts">
const model = defineModel()
defineEmits(['change-limit'])
const optionValues = [5, 10, 20, 50, 100]
</script>

<template>
  <label className="flex justify-end mr-32 font-extrabold text-xl">
    Limit per page:
    <select
      v-model="model"
      className="bg-lime-700 text-white"
      name="itemsPerPage"
      id="itemsPerPage"
      @change="$emit('change-limit', 'limit', model)"
    >
      <option v-for="option in optionValues" :value="option" :key="option">
        {{ option }}
      </option>
    </select>
  </label>
</template>
