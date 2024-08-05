<script setup lang="ts">
import { getSkillStyle, SkillsEnum } from '@/models/skill/skillsEnum';
import { formatExperience, formatNumber } from '@/utils/formaters';
import { SkillEffect } from '@/models/skill/skillEffect';
const props = defineProps<{
  effect: SkillEffect;
}>();

const badgeStyle = getSkillStyle(props.effect.skill);
</script>

<template>
  <div class="badge"
       :style="{ backgroundColor: badgeStyle.bgColor, color: badgeStyle.textColor }"
       v-tooltip.top="formatNumber(effect.experience)"
  >
    <span>{{formatExperience(effect.experience)}}</span>
    <img v-if="badgeStyle.icon"
         :src="badgeStyle.icon"
         :alt="SkillsEnum[effect.skill] + ' skill icon'"
    />
  </div>
</template>

<style scoped>
.badge {
  display: flex;
  gap: 0.2em;
  align-items: center;
  width: fit-content;
  height: 1.5em;
  padding: 0.4em;
  border-radius: 10px;

  img {
    max-height: 100%;
    object-fit: contain;
  }
}
</style>