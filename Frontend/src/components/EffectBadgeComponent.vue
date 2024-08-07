<script setup lang="ts">
import { getSkillStyle, SkillsEnum } from '@/models/skill/skillsEnum';
import { formatExperience, formatNumber } from '@/utils/formaters';
import { SkillEffect } from '@/models/skill/skillEffect';
const props = withDefaults(defineProps<{
  effect: SkillEffect,
  removable?: boolean,
}>(), {
  removable: false,
});

const badgeStyle = getSkillStyle(props.effect.skill);
</script>

<template>
  <Chip
        :image="getSkillStyle(effect.skill).icon"
        :label="formatExperience(effect.experience)"
        :removable="removable"
        v-tooltip.top="formatNumber(effect.experience)"
        class="badge"
        :style="{ backgroundColor: badgeStyle.bgColor, color: badgeStyle.textColor }"
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