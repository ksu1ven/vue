<script setup lang="ts">
import { ref, computed, watch } from 'vue'
const props = defineProps<{
  totalPages: number
  pageNumber: number
}>()
const emit = defineEmits(['set-new-page-number'])
const paginationButtonsValue = ref<number[]>([])

watch(
  props,
  () => {
    paginationButtonsValue.value =
      props.pageNumber > 2
        ? [1, 2, 3].map((el, ind) => props.pageNumber + ind - 1 + el - el)
        : [1, 2, 3]
  },
  { immediate: true }
)

const paginationButtonsValueComputed = computed(() => {
  return paginationButtonsValue.value.filter((value) => props.totalPages > value)
})

const changePaginationButtonsValue = () => {
  if (
    props.totalPages - paginationButtonsValue.value[paginationButtonsValue.value.length - 1] <=
    1
  ) {
    return
  }
  const increaseNumber =
    props.totalPages - paginationButtonsValue.value[paginationButtonsValue.value.length - 1] <
    paginationButtonsValue.value.length
      ? 1
      : paginationButtonsValue.value.length

  paginationButtonsValue.value = paginationButtonsValue.value.map((el) => el + increaseNumber)

  const newPageNumber = paginationButtonsValue.value.at(-1) || 3 + increaseNumber
  emit('set-new-page-number', newPageNumber)
}

const clickNextPrevButton = (direction: 'next' | 'prev') => {
  const increaseDecreaseNumber = direction == 'next' ? 1 : -1
  const newPageNumber = props.pageNumber + increaseDecreaseNumber + 1

  if (!paginationButtonsValue.value.includes(newPageNumber)) {
    console.log('dont include')
    const changedArr = paginationButtonsValue.value.map((el) => el + increaseDecreaseNumber)
    paginationButtonsValue.value = changedArr
  }
  emit('set-new-page-number', newPageNumber)
}

const clickLastPage = () => {
  if (props.totalPages > paginationButtonsValue.value.length)
    paginationButtonsValue.value = paginationButtonsValue.value.map(
      (el, ind) => props.totalPages - paginationButtonsValue.value.length + ind + el - el
    )
  emit('set-new-page-number', props.totalPages)
}

const setPageNumber = (value: number) => {
  emit('set-new-page-number', value)
}
</script>

<template>
  <div className="flex justify-center gap-4 mb-10">
    <button
      className="w-14 h-14  text-4xl p-3 rounded-full text-white font-extrabold"
      :disabled="pageNumber - 1 < 0"
      @click="clickNextPrevButton('prev')"
    >
      {{ '<' }}
    </button>

    <button
      v-for="value in paginationButtonsValueComputed"
      :key="`button-${value}`"
      class="w-14 h-14 p-3 rounded-full text-white font-extrabold"
      :class="pageNumber + 1 === value ? 'bg-lime-300' : ' bg-lime-700'"
      @click="setPageNumber(value)"
    >
      {{ value }}
    </button>

    <button
      v-if="
        totalPages > paginationButtonsValueComputed[paginationButtonsValueComputed.length - 1] + 1
      "
      className="w-14 h-14  text-4xl p-3 rounded-full text-white font-extrabold"
      @click="changePaginationButtonsValue()"
    >
      ...
    </button>

    <button
      class="w-14 h-14 p-3 rounded-full text-white font-extrabold"
      :class="pageNumber + 1 === totalPages ? 'bg-lime-300' : ' bg-lime-700'"
      @click="clickLastPage()"
    >
      {{ totalPages }}
    </button>
    <button
      className="w-14 h-14 text-4xl p-3 rounded-full text-white font-extrabold"
      :disabled="pageNumber + 1 > totalPages - 1"
      @click="clickNextPrevButton('next')"
    >
      {{ '>' }}
    </button>
  </div>
</template>
