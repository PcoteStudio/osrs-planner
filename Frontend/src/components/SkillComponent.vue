<script setup lang="ts">
import { Skill } from '@/models/skill/skill';
import { XpTable } from '@/models/skill/xpTable';
import { useGlobalStore } from '@/stores/globalStore';
import { computed } from 'vue';
import { SkillEffect } from '@/models/skill/skillEffect';
import { formatNumber } from '@/utils/formaters';
import { EffectTypeEnum } from '@/models/effect';

const store = useGlobalStore();

const props = defineProps<{
  skill?: Skill;
  level?: number;
  experience?: number;
}>();

const xpTable = new XpTable(99); // TODO move table to static util

const currentStep = computed(() => store.getCurrentRoute.getCurrentStep());
const hasEffect = computed(() => {
  if (currentStep.value)
    return store.findEffect(currentStep.value.id, EffectTypeEnum.Skill, props.skill?.type) as SkillEffect;

  return undefined;
});

const computedExperience = computed(() => {
  if (props.experience)
    return props.experience;
  else if (props.skill)
    return props.skill.experience;
  return 0;
});

const computedLevel = computed(() => {
  if (props.level)
    return props.level;
  return xpTable.getLevel(computedExperience.value);
});

const skillTooltip = computed(() => {
  if (hasEffect.value?.experience) {
    return `${formatNumber(computedExperience.value - hasEffect.value?.experience)} <span class="highlight"> + ${formatNumber(hasEffect.value?.experience)}</span> = ${formatNumber(computedExperience.value)}`;
  }

  return formatNumber(computedExperience.value);
});
</script>

<template>
  <div
      class="skill"
      :class="{'has-effect': hasEffect}"
      v-tooltip.top="{ value: skillTooltip, escape: false }"
  >
    <img v-if="skill?.icon" :src="skill.icon" :alt="skill.type">
    <span class="label">
        {{ computedLevel }}
    </span>
  </div>
</template>

<style scoped>
.skill {
  background-color: #1a1a1a;
  display: flex;
  gap: 0.2rem;
  justify-content: space-evenly;
  align-items: center;

  &.has-effect {
    outline: deepskyblue 1px solid;
  }

  .label {
    text-align: center;
    padding-right: 0.3rem;
    width: 100%;
  }

  img {
    width: 2rem;
    flex-shrink: 0;
    aspect-ratio: 1/1;
    object-fit: contain;
    padding-left: 0.4rem;
    padding-right: 0.4rem;
  }

  &:hover {
    cursor: pointer;
  }
}
</style>