<script setup lang="ts">

import { ContainerItem } from '@/models/item/containerItem';
import ContextMenu from 'primevue/contextmenu';
import { computed, ref } from 'vue';
import { useGlobalStore } from '@/stores/globalStore';
import { formatShortNumbers } from '@/utils/formaters';

const store = useGlobalStore();

const props = withDefaults(defineProps<{
  item?: ContainerItem;
  error?: boolean
}>(), {
  error: false,
});

const menu = ref();
const items = computed(() => [
  {
    label: 'Bank',
    icon: 'pi pi-building-columns',
    command: () => store.openEffectModal(undefined, selectedSkill.value),
  },
  {
    label: 'Set quantity',
    icon: 'pi pi-pen-to-square',
    command: () => store.openEffectModal(undefined, selectedSkill.value),
  },
  {
    label: props.item?.item.noted ? 'Un-note' : 'Note',
    icon: 'pi pi-file',
    command: () => store.openEffectModal(undefined, selectedSkill.value),
  }
]);

const selectedSkill = ref();
const openContextMenu = (event : MouseEvent) => {
  menu.value.show(event);
};
</script>

<template>
  <div class="slot"
       :class="{ error: error }"
       @contextmenu="openContextMenu"
       @click="openContextMenu"
  >
    <img :src="item?.item.imageUrl" />
    <span v-if="item?.quantity !== 1"
          class="quantity-overlay"
          :class="{ white: item?.quantity >= 100000, green: item?.quantity >= 10000000 }"
    >
      {{ formatShortNumbers(item?.quantity) }}
    </span>
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
.slot {
  height: 100%;
  aspect-ratio: 1/1;
  position: relative;
  background-color: #222;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  padding: 0.2rem;

  .quantity-overlay {
    color: #ffff00;
    font-size: 16px;
    text-shadow: black 1px 1px;
    font-family: Runescape, serif;
    text-rendering: geometricPrecision;
    position: absolute;
    left: 0;
    top: 0;
    padding-left: 0.2em;
    &.white {
      color: white;
    }
    &.green {
      color: #00ff80;
    }
  }

  &.error {
    background-color: #6e0000;
  }
}
</style>