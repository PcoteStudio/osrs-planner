<script setup lang="ts">
import { useGlobalStore } from '@/stores/globalStore';
import { XpTable } from '@/models/skill/xpTable';
import { ref } from 'vue';
import { useDragStore } from '@/stores/dragStore';

const state = useGlobalStore();
const dragStore = useDragStore();
const xpTable = new XpTable(99); // TODO move table to static util

const levels = ref([]);
for (let i = 1; i <= 99; i++) {
  levels.value[i - 1] = `level: ${i}, exp: ${xpTable.getXp(i)}`;
}
</script>

<template>
<div class="debug">
  <pre>
Dragging: {{ dragStore.isDragging }}
    Source: {{ state.getNodeById(dragStore.dragFrom)?.step.label }} ({{ dragStore.dragFrom }})
    Target: {{ state.getNodeById(dragStore.dragTarget)?.step.label }} {{ dragStore.targetLocation }} ({{ dragStore.dragTarget }})
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