<script setup lang="ts">
import { useGlobalStore } from '@/stores/globalStore';
import { XpTable } from '@/models/skill/xpTable';
import { ref } from 'vue';

const state = useGlobalStore();
const xpTable = new XpTable(99); // TODO move table to static util

const levels = ref([]);
for (let i = 1; i <= 99; i++) {
  levels.value[i - 1] = `level: ${i}, exp: ${xpTable.getXp(i)}`;
}
</script>

<template>
<div class="debug">
  <pre>
{{ state.currentRoute.toString(state.currentRoute.rootNode) }}
{{ state.currentRoute.getCurrentStep() }}
{{ state.currentRoute.getPlayerState().skills }}
  </pre>
</div>
</template>

<style scoped>
.debug {
  overflow-y: auto;
  margin-left: auto;

  display: flex;
  flex-direction: column;
  gap: 3%;
  flex-grow: 0;
  min-height: 250px;
  padding: 1rem;
}
</style>