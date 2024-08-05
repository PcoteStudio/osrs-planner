<script setup lang="ts">
import { useGlobalStore } from '@/stores/globalStore';
import { computed } from 'vue';
import SkillComponent from '@/components/SkillComponent.vue';
import { Skill } from '@/models/skill/skill';

const state = useGlobalStore();

const skills = computed(() => {
  const skillList : Skill[] = [];
  for (const [key, value] of Object.entries(state.currentRoute.getPlayerState().skills)) {
    skillList.push(new Skill(key, value));
  }
  return skillList.sort((a, b) => a.order - b.order);
});

</script>

<template>
  <div class="skill-tab">
    <SkillComponent
        v-for="(skill, index) in skills"
        :key="index"
        :skill="skill"
    />
    <SkillComponent
        :level="state.currentRoute.playerState.getTotalLevel()"
        :experience="state.currentRoute.playerState.getTotalExperience()"
    />
  </div>
</template>

<style scoped>
  .skill-tab {
    background-color: var(--color-background-soft);
    height: 40%;
    min-height: 250px;
    aspect-ratio: 3 / 4;
    padding: 1rem;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 0.3rem;
  }
</style>