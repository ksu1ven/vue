<script setup lang="ts">
import pawImg from '../assets/paw.png'
import type { Animal } from '@/utils/types'
defineProps<{
  searchResultsArray: Readonly<Animal[]>
}>()

function checkDescription(animal: Animal) {
  const descriptionArr: string[] = []
  Object.entries(animal).forEach((el) => {
    if (el[1] === true) {
      descriptionArr.push(el[0])
    }
  })
  return descriptionArr.length ? descriptionArr.join(', ') : "API don't give us description :("
}
</script>
<template>
  <div v-if="searchResultsArray.length" className="w-1/3 m-auto mb-10 flex flex-col gap-5 ">
    <div
      v-for="animal in searchResultsArray"
      :key="animal.uid"
      className="flex justify-between gap-5 cursor-pointer"
    >
      <img :src="pawImg" alt="animal picture" className="w-16 h-16" />
      <div className="grow">
        <h2 className="font-extrabold mb-1">{{ animal.name }}</h2>
        <p>Description: {{ checkDescription(animal) }}</p>
      </div>
    </div>
  </div>
  <p v-else className="text-3xl w-1/3 m-auto mb-10">Nothing found:(</p>
</template>
