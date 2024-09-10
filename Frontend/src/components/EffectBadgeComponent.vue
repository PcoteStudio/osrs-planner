<script setup lang="ts">
import { getSkillStyle } from '@/models/skill/skillsEnum';
import { formatShortNumbers, formatNumber } from '@/utils/formaters';
import { Effect, EffectTypeEnum } from '@/models/effect';
import { computed, ref } from 'vue';
import type { SkillEffect } from '@/models/skill/skillEffect';
import ContextMenu from 'primevue/contextmenu';

const props = defineProps<{
  effect: Effect,
  removable?: boolean,
  edit?: (event: Event) => void,
  remove?: (event: Event) => void,
}>();

const content = computed(() => {
  switch (props.effect.type) {
    case EffectTypeEnum.Skill:
      const typedEffect = props.effect as SkillEffect;
      return {
        image: getSkillStyle(typedEffect.skill).icon,
        label: formatShortNumbers(typedEffect.experience),
        tooltip: formatNumber(typedEffect.experience),
        badgeStyle: {
          backgroundColor: getSkillStyle(typedEffect.skill).bgColor,
          color: getSkillStyle(typedEffect.skill).textColor,
        }
      };
  }
  return {};
});


const menu = ref();
const items = computed(() => {
  let actions = [];
  if (props.edit) {
    actions.push({
      label: 'Edit',
      icon: 'pi pi-pen-to-square',
      command: props.edit,
    });
  }

  if (props.remove && !props.removable) {
    actions.push({
      label: 'Remove',
      icon: 'pi pi-times',
      command: props.remove,
    });
  }

  return actions;
});

const openContextMenu = (event : MouseEvent) => items.value.length > 0 && menu.value.show(event);
</script>

<template>
  <Chip
    :image="content.image"
    :label="content.label"
    :removable="removable"
    v-tooltip.top="content.tooltip"
    :style="content.badgeStyle"
    class="badge"
    :class="{editable: items.length > 0}"
    @contextmenu="openContextMenu($event)"
    @click="openContextMenu($event)"
    @remove="remove"
  />
  <ContextMenu ref="menu" :model="items">
    <template #item="{ item, props }">
      <a v-ripple class="flex items-center" v-bind="props.action">
        <span :class="item.icon" />
        <span class="ml-2">{{ item.label }}</span>
      </a>
    </template>
  </ContextMenu>
</template>

<style>
.badge {
  height: 1.5rem;
  gap: 0.3em;

  &.editable {
    cursor: pointer;
  }


  & > img {
    height: 100%;
    width: fit-content;
    object-fit: scale-down;
    border-radius: unset;
  }
}
</style>