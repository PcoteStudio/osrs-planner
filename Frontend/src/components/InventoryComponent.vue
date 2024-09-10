<script setup lang="ts">

import ContextMenu from 'primevue/contextmenu';
import { computed, ref } from 'vue';
import { useGlobalStore } from '@/stores/globalStore';
import type { ContainerItem } from '@/models/item/containerItem';
import InventorySlotComponent from '@/components/InventorySlotComponent.vue';
import { EffectTypeEnum } from '@/models/effect';
import { getItemEffectTypeOptions, ItemEffectTypeEnum } from '@/types/itemEffectTypeEnum';

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

  let menuItems = [];
  const options = getItemEffectTypeOptions(ItemEffectTypeEnum.Pickup);
  menuItems.push({
    label: options.label,
    icon: options.icon,
    command: () => store.openEffectModal({
      category: EffectTypeEnum.Item,
      data: {
        stepId: currentStep.value.id,
        action: ItemEffectTypeEnum.Pickup
      }
    })
  });

  if (inventorySlot) {
    menuItems.unshift({ 'separator': true });
    for (const [key, value] of Object.entries(ItemEffectTypeEnum)) {
      if (value === ItemEffectTypeEnum.Pickup)
        continue;

      const options = getItemEffectTypeOptions(value);
      if (options.category !== 'inventory')
        continue;

      menuItems.unshift({
        label: options.label,
        icon: options.icon,
        type: key,
        command: () => store.openEffectModal({
          category: EffectTypeEnum.Item,
          data: {
            stepId: currentStep.value.id,
            action: value,
            item: inventorySlot.item
          }
        })
      });
    }
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

  <ContextMenu ref="menu" :model="items">
    <template #item="{ item, props }">
      <a v-ripple class="flex items-center" v-bind="props.action">
        <font-awesome-icon :icon="item.icon" />
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