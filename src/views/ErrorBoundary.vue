<template>
  <div v-if="error">
    <p>Error occurred: {{ errorMessage }}</p>
  </div>
  <div v-else>
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
// errorCaptured(err, vm, info) {
//   this.error = true;
//   this.errorMessage = err.toString();

//   console.error(`Error: ${err.toString()}\nInfo: ${info}`);
//   return false;
// }
</script>
