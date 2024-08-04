<script setup lang="ts">
import { EffectModel } from '@/models/effectModel';
import { getSkillStyle, SkillsEnum } from '@/models/skill/skillsEnum';
import { formatExperience } from '@/utils/formaters';

const props = defineProps<{
  effect: EffectModel;
}>();

const badgeStyle = getSkillStyle(props.effect.skill);
</script>

<template>
  <n-tooltip trigger="hover" :delay="500" :keep-alive-on-hover="false">
    <template #trigger>
      <div class="badge"
           :style="{ backgroundColor: badgeStyle.bgColor, color: badgeStyle.textColor }"
      >
        <span>{{formatExperience(effect.experience)}}</span>
        <img v-if="badgeStyle.icon"
             :src="badgeStyle.icon"
             :alt="SkillsEnum[effect.skill] + ' skill icon'"
        />
      </div>
    </template>
    {{ effect.experience }}
  </n-tooltip>
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