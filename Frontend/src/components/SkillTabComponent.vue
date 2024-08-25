<script setup lang="ts">
import { useGlobalStore } from '@/stores/globalStore';
import { computed, ref } from 'vue';
import SkillComponent from '@/components/SkillComponent.vue';
import { Skill } from '@/models/skill/skill';
import ContextMenu from 'primevue/contextmenu';
import type { SkillsEnum } from '@/models/skill/skillsEnum';
import { EffectTypeEnum } from '@/models/effect';

const store = useGlobalStore();

const skills = computed(() => {
  const skillList : Skill[] = [];
  for (const [key, value] of Object.entries(store.getCurrentSkills)) {
    skillList.push(new Skill(key as SkillsEnum, value || 0));
  }
  return skillList.sort((a, b) => a.order - b.order);
});

const menu = ref();
const items = ref([
  {
    label: 'effect',
    icon: 'pi pi-plus',
    command: () => store.openEffectModal({
      category: EffectTypeEnum.Skill,
      data: {
        stepId: store.getCurrentRoute.getCurrentStep()
        skill: selectedSkill.value,
      }
    }),
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
        :level="store.getCurrentRoute.getPlayerState().skills.getTotalLevel()"
        :experience="store.getCurrentRoute.getPlayerState().skills.getTotalExperience()"
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
    padding: 1rem;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 0.3rem;
    width: fit-content;
    aspect-ratio: 3 / 4;
    flex: 1;
  }
</style>