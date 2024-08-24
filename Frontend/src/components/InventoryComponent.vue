<script setup lang="ts">

import ContextMenu from 'primevue/contextmenu';
import { computed, ref } from 'vue';
import { useGlobalStore } from '@/stores/globalStore';
import type { ContainerItem } from '@/models/item/containerItem';
import InventorySlotComponent from '@/components/InventorySlotComponent.vue';

const store = useGlobalStore();

const currentStep = computed(() => store.getCurrentRoute.getCurrentStep());
const inventorySlots = computed(() => {
  let slots = store.getInventory.getSlots();

  if (slots.length < 28) {
    slots = slots.concat(new Array(
      28 - store.getInventory.getSlots().length
    ));
  }

  return slots;
});

const menu = ref();
const items = ref();

const selectedSkill = ref();
const openContextMenu = (event: MouseEvent, inventorySlot: ContainerItem) => {
  let menuItems = [
    {
      label: 'Add',
      icon: 'pi pi-plus',
      command: () => store.openEffectModal(currentStep.value?.id),
    }
  ];

  if (inventorySlot) {
    menuItems = [
      {
        label: 'Bank',
        icon: 'pi pi-building-columns',
        command: () => store.openEffectModal(currentStep.value?.id, inventorySlot.item),
      },
      {
        label: 'Set quantity',
        icon: 'pi pi-pen-to-square',
        command: () => store.openEffectModal(currentStep.value?.id, inventorySlot.item),
      },
      {
        label: inventorySlot?.item.noted ? 'Un-note' : 'Note',
        icon: 'pi pi-file',
        command: () => store.openEffectModal(currentStep.value?.id, inventorySlot.item),
      },
      {
        separator: true
      },
      ...menuItems
    ];
  }

  items.value = menuItems;
  menu.value.show(event);
};
</script>

<template>
  <div class="inventory-tab">
    <div v-for="(inventorySlot, index) of inventorySlots"
         :key="index"
         class="slot"
    >
      <InventorySlotComponent
          :item="inventorySlot"
          :error="index >= 28"
          @contextmenu="(e: MouseEvent) => openContextMenu(e, inventorySlot)"
      />
    </div>
  </div>

  <ContextMenu ref="menu" :model="items" @hide="selectedSkill = null">
    <template #item="{ item, props }">
      <a v-ripple class="flex items-center" v-bind="props.action">
        <span :class="item.icon" />
        <img v-if="selectedSkill?.icon" :src="selectedSkill?.icon" :alt="selectedSkill?.type">
        <span class="ml-2">{{ item.label }}</span>
      </a>
    </template>
  </ContextMenu>
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