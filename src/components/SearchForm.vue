<script setup lang="ts">
const model = defineModel()
defineEmits(['submit-form'])

const throwError = () => {
  throw new Error(`Hello, I'm error!`)
}
</script>

<template>
  <form
    action="#"
    @submit.prevent="$emit('submit-form', 'page', '')"
    className="w-3/5 flex justify-center m-auto gap-x-10 rounded"
  >
    <button
      type="button"
      className="w-1/5 bg-lime-700 p-3 rounded text-white font-extrabold"
      @click="throwError()"
    >
      Error
    </button>

    <input v-model.trim="model" type="text" name="search" id="search" className="w-1/3 p-3" />

    <button type="submit" className="w-1/5 bg-lime-700 p-3 rounded text-white font-extrabold">
      Search
    </button>
  </form>
</template>
