<script setup lang="ts">
import { getSkillStyle } from '@/models/skill/skillsEnum';
import { formatExperience, formatNumber } from '@/utils/formaters';
import { Effect, EffectTypeEnum } from '@/models/effect';
import { computed } from 'vue';
import type { SkillEffect } from '@/models/skill/skillEffect';

const props = withDefaults(defineProps<{
  effect: Effect,
  removable?: boolean,
  command?: Function,
}>(), {
  removable: false,
  command: () => {},
});

const content = computed(() => {
  switch (props.effect.type) {
    case EffectTypeEnum.Skill:
      // eslint-disable-next-line no-case-declarations
      const typedEffect = props.effect as SkillEffect;
      return {
        image: getSkillStyle(typedEffect.skill).icon,
        label: formatExperience(typedEffect.experience),
        tooltip: formatNumber(typedEffect.experience),
        badgeStyle: {
          backgroundColor: getSkillStyle(typedEffect.skill).bgColor,
          color: getSkillStyle(typedEffect.skill).textColor,
        }
      };
  }
  return {};
});
</script>

<template>
  <Chip
    :image="content.image"
    :label="content.label"
    :removable="removable"
    v-tooltip.top="content.tooltip"
    :style="content.badgeStyle"
    class="badge"
    @remove="command"
  />
</template>

<style>
.badge {
  height: 1.5rem;
  gap: 0.3em;

  & > img {
    height: 100%;
    width: fit-content;
    object-fit: scale-down;
    border-radius: unset;
  }
  & > svg {
    color: unset;
  }
}
</style>