<script setup lang="ts">
const { pageNumber, paginationButtonsValue, totalPages } = defineProps<{
  paginationButtonsValue: number[]
  totalPages: number
  pageNumber: number
}>()
defineEmits([
  'click-last-page',
  'click-next-prev-button',
  'change-pagination-buttons-value',
  'set-page-number'
])
</script>

<template>
  <div className="flex justify-center gap-4 mb-10">
    <button
      className="w-14 h-14  text-4xl p-3 rounded-full text-white font-extrabold"
      :disabled="pageNumber - 1 < 0"
      @click="$emit('click-next-prev-button', 'prev')"
    >
      {{ '<' }}
    </button>

    <button
      v-for="value in paginationButtonsValue"
      :key="`button-${value}`"
      class="w-14 h-14 p-3 rounded-full text-white font-extrabold"
      :class="pageNumber + 1 === value ? 'bg-lime-300' : ' bg-lime-700'"
      @click="$emit('set-page-number', value)"
    >
      {{ value }}
    </button>

    <button
      v-if="totalPages > paginationButtonsValue[paginationButtonsValue.length - 1] + 1"
      className="w-14 h-14  text-4xl p-3 rounded-full text-white font-extrabold"
      @click="$emit('change-pagination-buttons-value')"
    >
      ...
    </button>

    <button
      class="w-14 h-14 p-3 rounded-full text-white font-extrabold"
      :class="pageNumber + 1 === totalPages ? 'bg-lime-300' : ' bg-lime-700'"
      @click="$emit('click-last-page')"
    >
      {{ totalPages }}
    </button>
    <button
      className="w-14 h-14 text-4xl p-3 rounded-full text-white font-extrabold"
      :disabled="pageNumber + 1 > totalPages - 1"
      @click="$emit('click-next-prev-button', 'next')"
    >
      {{ '>' }}
    </button>
  </div>
</template>
