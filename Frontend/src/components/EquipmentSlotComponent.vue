<script setup lang="ts">

import { computed } from 'vue';
import { EquipmentSlotTypes, getPlaceholderSrc } from '@/models/item/equipmentSlot';
import { useGlobalStore } from '@/stores/globalStore';

const props = withDefaults(defineProps<{
  isVisible?: boolean;
  disabled?: boolean;
  type: EquipmentSlotTypes;
}>(), {
  disabled: false,
  isVisible: true,
});

const state = useGlobalStore();


const item = state.currentPlayerState.equipment.slots[props.type]?.item;

const isPlaceholder = computed(() => !item?.imageUrl);
let slotImage = computed(() => {
  if(item?.imageUrl) {
    return item.imageUrl;
  }

  return getPlaceholderSrc(props.type);
});

const replaceWithPlaceholder = (e: any) => {
  e.target.src = getPlaceholderSrc(props.type);
};
</script>

<template>
  <div class="slot" :class="{ hidden: ! isVisible }">
    <n-tooltip trigger="hover" :delay="100" :keep-alive-on-hover="false">
      <template #trigger>
        <div class="content">
          <img :src="slotImage"
               v-if="slotImage"
               :class="{placeholder: isPlaceholder}"
               :alt="EquipmentSlotTypes[props.type]"
               @error="replaceWithPlaceholder"
          />
        </div>
      </template>
      {{ EquipmentSlotTypes[props.type] }}
    </n-tooltip>
  </div>
</template>

<style scoped>
.slot {
  background: #1a1a1a;
  position: relative;
  overflow: hidden;
  height: 100%;
  aspect-ratio: 1 / 1;
  border-radius: 10%;
  cursor: pointer;

  .content {
    position: absolute;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;

    img {
      width: 70%;
      object-fit: contain;
      image-rendering: pixelated;

      &.placeholder {
        width: fit-content;
        filter: invert(52%) sepia(9%) saturate(8%) hue-rotate(324deg) brightness(95%) contrast(90%);
      }
    }
  }
}

.hidden {
  visibility: hidden;
}
</style>