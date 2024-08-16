<script setup lang="ts">

const props = withDefaults(defineProps<{
  minWidth?: string;
  maxWidth?: string;
}>(), {
  minWidth: '14rem'
});
</script>

<template>
  <div class="tab" :style="{ minWidth: minWidth, maxWidth: maxWidth }">
    <slot></slot>
  </div>
</template>

<style scoped>
.tab {
  background-color: var(--color-background-soft);
  display: flex;
  flex: 1;

  border: darkred solid 1px;
  max-height: 100%;
  width: fit-content;
  height: fit-content;
  overflow-y: auto;
}
</style>