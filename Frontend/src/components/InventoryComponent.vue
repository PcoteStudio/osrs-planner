<script setup lang="ts">

import ContextMenu from 'primevue/contextmenu';
import { computed, ref } from 'vue';
import { useGlobalStore } from '@/stores/globalStore';

const store = useGlobalStore();

const inventorySlots = computed(() => {
  let slots = store.getInventory.getSlots()
    .concat(new Array(
      28 - store.getInventory.getSlots().length + 2
    ));

  return slots;
});
</script>

<template>
  <div class="inventory-tab">
    <div v-for="(inventorySlot, index) of inventorySlots"
         :key="index"
         class="slot"
    >
      <InventorySlotComponent :item="inventorySlot" :error="index >= 28" />
    </div>
  </div>
</template>

<style scoped>
.inventory-tab {
  padding: 1rem;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-auto-rows: 1fr;
  gap: 0.3rem;
  width: 100%;
}
</style>