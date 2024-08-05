<script setup lang="ts">
import { useGlobalStore } from '@/stores/globalStore';
import { computed, ref } from 'vue';
import SkillComponent from '@/components/SkillComponent.vue';
import { Skill } from '@/models/skill/skill';
import ContextMenu from 'primevue/contextmenu';

const state = useGlobalStore();

const skills = computed(() => {
  const skillList : Skill[] = [];
  for (const [key, value] of Object.entries(state.currentRoute.getPlayerState().skills)) {
    skillList.push(new Skill(key, value));
  }
  return skillList.sort((a, b) => a.order - b.order);
});

const menu = ref();
const items = ref([
  {
    label: 'effect',
    icon: 'pi pi-plus',
    command: () => state.addEffect(selectedSkill.value.type),
  }
]);

const selectedSkill = ref();
const openContextMenu = (event : MouseEvent, skill: Skill) => {
  selectedSkill.value = skill;
  menu.value.show(event);
};
</script>

<template>
  <div class="skill-tab">
    <SkillComponent
        v-for="(skill, index) in skills"
        :key="index"
        :skill="skill"
        @contextmenu="openContextMenu($event, skill)"
        @click="openContextMenu($event, skill)"
    />
    <SkillComponent
        :level="state.currentRoute.playerState.getTotalLevel()"
        :experience="state.currentRoute.playerState.getTotalExperience()"
    />

    <ContextMenu ref="menu" :model="items" @hide="selectedSkill = null">
      <template #item="{ item, props }">
        <a v-ripple class="flex items-center" v-bind="props.action">
          <span :class="item.icon" />
          <img v-if="selectedSkill?.icon" :src="selectedSkill?.icon" :alt="selectedSkill?.type">
          <span class="ml-2">{{ item.label }}</span>
        </a>
      </template>
    </ContextMenu>
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