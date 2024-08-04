<script setup lang="ts">
import {useGlobalStore} from "@/stores/globalStore";

const state = useGlobalStore();

</script>

<template>
<div class="debug">
  <pre>
    {{ state.currentRoute.getPlayerState() }}
  </pre>
</div>
</template>

<style scoped>
.debug {
  overflow-y: auto;
  margin-left: auto;

  background-color: var(--color-background-soft);
  display: flex;
  flex-direction: column;
  gap: 3%;
  flex-grow: 0;
  min-height: 250px;
  padding: 1rem;
}
</style>