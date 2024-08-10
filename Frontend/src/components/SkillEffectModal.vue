<script setup lang="ts">

import Select from 'primevue/select';
import InputText from 'primevue/inputtext';
import { computed, ref, watch } from 'vue';
import { getSkillStyle, SkillsEnum } from '@/models/skill/skillsEnum';
import { useGlobalStore } from '@/stores/globalStore';
import { formatNumber } from '@/utils/formaters';
import Button from 'primevue/button';
import { SkillEffect } from '@/models/skill/skillEffect';
import { XpHelper } from '@/models/skill/xpHelper';
import { StepTreeNode } from '@/models/stepTreeNode';
import { EffectTypeEnum } from '@/models/effect';

const store = useGlobalStore();

const experience = ref(0);
const selectedSkill = ref();
const levelInvalid = ref(false);

const props = defineProps<{
  node: StepTreeNode
}>();

const level = computed({
  get() {
    return newLevel.value;
  },
  set(newLevel) {
    if(newLevel <= currentLevel.value) {
      newLevel = currentLevel.value + 1;
      levelInvalid.value = true;
    }
    else if(newLevel > 99){
      newLevel = 99;
      levelInvalid.value = true;
    }
    else{
      experience.value = Number(XpHelper.getXp(newLevel)) - Number(currentExp.value || 0);
      levelInvalid.value = false;
    }
  },
});

const skillTypes = computed(() => {
  const skillList = [];
  for (const [key, value] of Object.entries(SkillsEnum)) {
    skillList.push({ name: value, icon: getSkillStyle(value).icon, type: key });
  }
  return skillList;
});

watch(store.getEffectState, (state) => {
  selectedSkill.value = skillTypes.value.find(s => s.type === state.skill);
}, { immediate: true });

const addExperience = (exp: number) => {
  experience.value = Number(experience.value) + exp;
};

const addEffect = () => {
  if (!selectedSkill.value && !experience.value)
    throw new Error(`selectedSkill: ${selectedSkill.value} and experience ${experience.value} need to be defined`);

  const newEffect = new SkillEffect(selectedSkill.value.type, Number(experience.value));
  store.addEffect(props.node.step.id, newEffect);
  store.closeEffectModal();
};

const currentAppliedEffect = computed(() => store.findEffect(props.node.step.id, EffectTypeEnum.Skill, selectedSkill.value?.name));

const currentExp = computed(() => {
  if (!selectedSkill.value)
    return 0;

  let exp = store.getCurrentSkillExp(selectedSkill.value.name);
  if (currentAppliedEffect.value instanceof SkillEffect){
    exp -= Number(currentAppliedEffect.value.experience);
  }
  return exp;
});
const currentLevel = computed(() => XpHelper.getLevel(currentExp.value));
const additionalExp = computed(() => currentExp.value + Number(experience.value));
const newLevel = computed(() => XpHelper.getLevel(currentExp.value + Number(experience.value)));
const nextLevel = computed(() => (newLevel.value < 99) ? newLevel.value + 1 : newLevel.value);
const expUntilNextLevel = computed(() => XpHelper.getXpUntilNextLevel(additionalExp.value) || 0);

watch(selectedSkill, () => {
  if (currentAppliedEffect.value instanceof SkillEffect) {
    experience.value = currentAppliedEffect.value.experience;
  }
  else {
    level.value = currentLevel.value + 1;
  }
}, { immediate: true });

const invalidForm = computed(() => {
  // 0 < Experience <= 200m && selectedSkill
  return !(experience.value > 0 && experience.value <= 200000000 && selectedSkill);
});
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
    <div v-if="selectedSkill" class="w-full grid grid-cols-2 gap-2">
      <FloatLabel>
        <InputText v-model="experience" id="experience" type="number" class="w-full" />
        <label for="experience">Experience</label>
      </FloatLabel>
      <FloatLabel>
        <InputText v-model="level" id="level" type="number" class="w-full" />
        <label for="level">Target level</label>
      </FloatLabel>
      <span v-if="selectedSkill && experience" class="w-full text-center" :class="{ invalid: invalidForm }">
        {{ formatNumber(currentExp) }} <span class="highlight">+ {{ formatNumber(experience) }}</span> = <span class="highlight">{{ formatNumber(additionalExp) }}</span>
      </span>
       <span v-if="selectedSkill && experience"  class="w-full text-center" :class="{ invalid: invalidForm }">
        {{ currentLevel }} → <span class="highlight">{{ newLevel }}</span>
      </span>
    </div>
    <span v-if="selectedSkill && experience"
          class="w-full text-center" style="margin-top: -1rem"
          :class="{ invalid: levelInvalid }">
      <a href="#" class="highlight" @click="addExperience(expUntilNextLevel)">{{ formatNumber(expUntilNextLevel) }} xp</a> left to reach level {{ nextLevel }}
    </span>
    <div class="flex justify-end gap-2">
      <Button type="button" label="Cancel" severity="secondary" @click="store.closeEffectModal" size="small" />
      <Button type="button" label="Add effect" @click="addEffect()" :disabled="invalidForm" size="small" />
    </div>
  </div>
</template>

<style scoped>
.invalid > .highlight {
  color: gray;
}

a {
  text-decoration: underline;
}
</style>