<script setup lang="ts">

import {EquipmentSlots, getPlaceholderSrc} from "@/models/item/equipmentSlots";
import type {Item} from "@/models/item/item";
import {computed, ref} from "vue";

const props = withDefaults(defineProps<{
  isVisible?: boolean;
  disabled?: boolean;
  type: EquipmentSlots;
  item?: Item;
}>(), {
  disabled: false,
  isVisible: true,
});

let isPlaceholder = ref(false);

let slotImage = computed(() => {
  if(props.item?.imageUrl) {
    isPlaceholder.value = false;
    return props.item?.imageUrl;
  }

  isPlaceholder.value = true;
  return getPlaceholderSrc(props.type);
})

const replaceWithPlaceholder = (e: any) => {
  isPlaceholder.value = true;
  e.target.src = getPlaceholderSrc(props.type);
}
</script>

<template>
  <div class="slot" :class="{ hidden: ! isVisible }">
    <n-tooltip trigger="hover" placement="bottom" :delay="500" :keep-alive-on-hover="false">
      <template #trigger>
        <div class="content">
          <img :src="slotImage"
               v-if="slotImage"
               :class="{placeholder: isPlaceholder}"
               :alt="EquipmentSlots[props.type]"
               @error="replaceWithPlaceholder"
          />
        </div>
      </template>
      {{ EquipmentSlots[props.type] }}
    </n-tooltip>
  </div>
</template>

<style scoped>
.slot {
  background: #2c3e50;
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