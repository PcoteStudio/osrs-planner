<script setup lang="ts">
import type { StepTreeNode } from '@/models/route';

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
  display: flex;
  flex: 1;

  border: darkred solid 1px;
  max-height: 100%;
  width: fit-content;
  height: fit-content;
  overflow-y: auto;
}
</style>