<script setup lang="ts">

import { StepTreeNode } from '@/models/stepTreeNode';
import { computed, ref, watch } from 'vue';
import { useGlobalStore } from '@/stores/globalStore';
import { EffectTypeEnum } from '@/models/effect';
import { getItemEffectTypeOptions, ItemEffectTypeEnum } from '@/types/itemEffectTypeEnum';
import SelectFuzzyComponent from '@/components/SelectFuzzyComponent.vue';

const store = useGlobalStore();

const props = defineProps<{
  node: StepTreeNode
}>();

const selectedAction = ref();

const availableActions = computed(() => {
  const actions = [];
  for (const [key, value] of Object.entries(ItemEffectTypeEnum)) {
    const options = getItemEffectTypeOptions(value);
    actions.push({
      name: options.label,
      icon: options.icon,
      type: key,
    });
  }
  return actions;
});

watch(store.getEffectState, (state) => {
  if (state.effect?.category === EffectTypeEnum.Item) {
    const action = state.effect.data.action;

    if (action)
      selectedAction.value = availableActions.value.find(s => s.type === action);
  }
}, { immediate: true });

</script>

<template>
  <div class="flex flex-col gap-8 w-full">
    <FloatLabel>
      <Select v-model="selectedAction"
              :options="availableActions"
              optionLabel="name"
              placeholder="Select an action"
              class="w-full"
      >
        <template #value="slotProps">
          <div v-if="slotProps.value" class="flex items-center">
            <font-awesome-icon
                :icon="slotProps.value.icon"
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
            <font-awesome-icon
                :icon="slotProps.option.icon"
                class="mr-2"
                style="width: 18px"
            />
            <div>{{ slotProps.option.name }}</div>
          </div>
        </template>
      </Select>
      <label for="effectTypes">Action</label>
    </FloatLabel>
    <SelectFuzzyComponent />
<!--    <div v-if="selectedSkill" class="w-full grid grid-cols-2 gap-2">-->
<!--      <FloatLabel>-->
<!--        <InputText v-model="experience" id="experience" type="number" class="w-full" />-->
<!--        <label for="experience">Experience</label>-->
<!--      </FloatLabel>-->
<!--      <FloatLabel>-->
<!--        <InputText v-model="level" id="level" type="number" class="w-full" />-->
<!--        <label for="level">Target level</label>-->
<!--      </FloatLabel>-->
<!--      <span v-if="selectedSkill && experience" class="w-full text-center" :class="{ invalid: invalidForm }">-->
<!--        {{ formatNumber(currentExp) }} <span class="highlight">+ {{ formatNumber(experience) }}</span> = <span class="highlight">{{ formatNumber(additionalExp) }}</span>-->
<!--      </span>-->
<!--      <span v-if="selectedSkill && experience"  class="w-full text-center" :class="{ invalid: invalidForm }">-->
<!--        {{ currentLevel }} → <span class="highlight">{{ newLevel }}</span>-->
<!--      </span>-->
<!--    </div>-->
<!--    <span v-if="selectedSkill && experience"-->
<!--          class="w-full text-center" style="margin-top: -1rem"-->
<!--          :class="{ invalid: levelInvalid }">-->
<!--      <a href="#" class="highlight" @click="addExperience(expUntilNextLevel)">{{ formatNumber(expUntilNextLevel) }} xp</a> left to reach level {{ nextLevel }}-->
<!--    </span>-->
<!--    <div class="flex justify-end gap-2">-->
<!--      <Button type="button" label="Cancel" severity="secondary" @click="store.closeEffectModal" size="small" />-->
<!--      <Button type="button" :label="currentAppliedEffect ? 'Edit effect' : 'Add effect'" @click="addEffect()" :disabled="invalidForm" size="small" />-->
<!--    </div>-->
  </div>
</template>

<style scoped>

</style>