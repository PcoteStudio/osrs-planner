<script setup lang="ts">

import { ContainerItem } from '@/models/item/containerItem';
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

const item = computed(() => props.item?.item);
const quantity = computed(() => props.item?.quantity || 0);

const openContextMenu = (event : MouseEvent) => {
  menu.value.show(event);
};
</script>

<template>
  <div class="slot"
       :class="{ error: error, 'outline-red': quantity < 0 }"
  >
    <div v-if="quantity !== 0">
      <img :src="item?.imageUrl"  :alt="item?.name" />
      <span v-if="quantity !== 1"
            class="quantity-overlay"
            :class="{
        white: quantity >= 100000,
        green: quantity >= 10000000,
        red: quantity < 0
      }"
      >
        {{ formatShortNumbers(quantity) }}
      </span>
    </div>
  </div>
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
    &.red {
      color: red;
    }
  }

  &.outline-red {
    outline: red 1px solid;
  }

  &.error {
    background-color: #6e0000;
  }
}
</style>