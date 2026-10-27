<script setup lang="ts">
withDefaults(defineProps<{
  direction?: 'up-right' | 'down' | 'up' | 'right' | 'undo'
}>(), { direction: 'up-right' })

const paths = {
  'up-right': 'M5 19 19 5M5 5h14v14',
  down: 'M12 4v16m-7-7 7 7 7-7',
  up: 'M12 20V4m-7 7 7-7 7 7',
  right: 'M4 12h16m-7-7 7 7-7 7',
  undo: 'M9 4 4 9l5 5M4 9h10a6 6 0 0 1 0 12h-2'
}
</script>

<template>
  <svg
    class="arrow-icon"
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="1.75"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
    focusable="false"
  >
    <path :d="paths[direction]" />
  </svg>
</template>

<style scoped>
.arrow-icon {
  display: inline-block;
  width: 1em;
  height: 1em;
  flex-shrink: 0;
  vertical-align: -0.125em;
}
</style>
