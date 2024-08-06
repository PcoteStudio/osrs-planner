<script setup lang="ts">

import Select from 'primevue/select';
import InputText from 'primevue/inputtext';
import { computed, ref, watch } from 'vue';
import { getSkillStyle, SkillsEnum } from '@/models/skill/skillsEnum';
import { XpTable } from '@/models/skill/xpTable';
import { useGlobalStore } from '@/stores/globalStore';
import { formatNumber } from '../utils/formaters';
import Button from 'primevue/button';
import { SkillEffect } from '@/models/skill/skillEffect';

const state = useGlobalStore();

const experience = ref(0);
const selectedSkill = ref();
const levelInput = ref(true);
const levelInvalid = ref(false);

const level = computed({
  get() {
    return newLevel.value;
  },
  set(newLevel) {
    if (newLevel > currentLevel.value && newLevel <= 99) {
      levelInvalid.value = false;
      experience.value = xpTable.getXp(newLevel) - Number(currentExp.value);
    }
    else {
      levelInvalid.value = true;
    }
  },
});

const skillTypes = computed(() => {
  const skillList = [];
  for (const [key, value] of Object.entries(SkillsEnum)) {
    skillList.push({ name: value, icon: getSkillStyle(SkillsEnum[key]).icon, type: key });
  }
  return skillList;
});

watch(state.effectState, (effectState) => {
  selectedSkill.value = skillTypes.value.find(s => s.type === effectState.skill);
}, { immediate: true });

watch(levelInput, () => {
  if (levelInput.value)
  {
    experience.value = xpTable.getXp(newLevel.value) - Number(currentExp.value);
  }
});

const addExperience = (exp: number) => {
  experience.value =  Number(experience.value) + exp;
};

const addEffect = () => {
  const newEffect = new SkillEffect(selectedSkill.value.type, experience);
  state.addEffect(newEffect);
  state.effectState.showModal = false;
};

const xpTable = new XpTable(99); // TODO move table to static util

const currentExp = computed(() => state.currentRoute.playerState.skills[selectedSkill.value.name] as number);
const additionalExp = computed(() => currentExp.value + Number(experience.value));
const currentLevel = computed(() => xpTable.getLevel(currentExp.value));
const newLevel = computed(() => xpTable.getLevel(currentExp.value + Number(experience.value)));
const nextLevel = computed(() => {
  if (newLevel.value < 99)
    return newLevel.value + 1;
  return newLevel.value;
});
const expUntilNextLevel = computed(() => {
  if (newLevel.value < 99)
    return xpTable.getXp(nextLevel.value) - additionalExp.value;
  return 0;
});

experience.value = expUntilNextLevel.value;
</script>

<template>
  <div class="flex flex-col gap-8 w-full">
    <FloatLabel>
      <Select v-model="selectedSkill"
              id="skillType"
              :options="skillTypes"
              optionLabel="name"
              placeholder="Select a skill"
              class="w-full"
      >
        <template #value="slotProps">
          <div v-if="slotProps.value" class="flex items-center">
            <img :alt="slotProps.value.name"
                 :src="slotProps.value.icon"
                 class="mr-2"
                 style="width: 18px"
            />
            <div>{{ slotProps.value.name }}</div>
          </div>
          <span v-else>
                  {{ slotProps.placeholder }}
              </span>
        </template>
        <template #option="slotProps">
          <div class="flex items-center">
            <img :alt="slotProps.option.name"
                 :src="slotProps.option.icon"
                 class="mr-2"
                 style="width: 18px"
            />
            <div>{{ slotProps.option.name }}</div>
          </div>
        </template>
      </Select>
      <label for="effectTypes">Skill</label>
    </FloatLabel>
    <div class="w-full grid grid-cols-2 gap-2">
      <FloatLabel>
        <InputText v-model="experience" id="experience" type="number" class="w-full" />
        <label for="experience">Experience</label>
      </FloatLabel>
      <FloatLabel>
        <InputText v-model="level" id="level" type="number" class="w-full" />
        <label for="level">Target level</label>
      </FloatLabel>
      <span v-if="selectedSkill && experience" class="w-full text-center" :class="{ invalid: levelInvalid && levelInput }">
        {{ formatNumber(currentExp) }} <span class="highlight">+ {{ formatNumber(experience) }}</span> = <span class="highlight">{{ formatNumber(additionalExp) }}</span>
      </span>
       <span v-if="selectedSkill && experience"  class="w-full text-center" :class="{ invalid: levelInvalid && levelInput }">
        {{ currentLevel }} → <span class="highlight">{{ newLevel }}</span>
      </span>
    </div>
    <span v-if="selectedSkill && experience"
          class="w-full text-center" style="margin-top: -1rem"
          :class="{ invalid: levelInvalid && levelInput }">
      <a href="#" class="highlight" @click="addExperience(expUntilNextLevel)">{{ formatNumber(expUntilNextLevel) }} xp</a> left to reach level {{ nextLevel }}
    </span>
    <div class="flex justify-end gap-2">
      <Button type="button" label="Cancel" severity="secondary" @click="state.effectState.showModal = false" size="small" />
      <Button type="button" label="Add effect" @click="addEffect()" size="small" />
    </div>
  </div>
</template>

<style scoped>

a {
  text-decoration: underline;
}

.calculations {
  display: flex;
  flex-direction: column;
  align-items: center;

  &.invalid {
    color: gray;
    .highlight {
      color: gray;
    }
  }
}
</style>