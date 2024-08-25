<script setup lang="ts">
import Dialog from 'primevue/dialog';
import Select from 'primevue/select';

import { useGlobalStore } from '@/stores/globalStore';
import { computed, ref, watch } from 'vue';
import { Effect, EffectTypeEnum } from '@/models/effect';
import SkillEffectModal from '@/components/SkillEffectModal.vue';
import CompletionEffectModal from '@/components/CompletionEffectModal.vue';
import ItemEffectModal from '@/components/ItemEffectModal.vue';
import EffectBadgeComponent from '@/components/EffectBadgeComponent.vue';
import { type EffectCategory, getEffectCategories } from '@/types/EffectCategory';
import { SkillEffect } from '@/models/skill/skillEffect';

const store = useGlobalStore();

const selectedEffectType = ref();
const selectedNode = ref();

const effectCategories : EffectCategory[] = getEffectCategories();

const nodes = ref(store.getNodeList);
const effectList = computed(() => selectedNode.value.step.effects);
const filteredEffectList = computed(() => effectList.value?.filter((e: Effect) => e.type === selectedEffectType.value?.type));

const showModal = computed(() => store.getEffectState.showModal);
watch(showModal, () => {
  if (!showModal.value)
    return;

  selectedNode.value = store.getNodeById(store.getEffectState.effect?.data.stepId)
      || store.getCurrentRoute.currentNode;

  selectedEffectType.value = effectCategories.find(
    (e: EffectCategory) => e.type === store.getEffectState.effect?.category);


}, { immediate: true });

const removeEffect = (effect: Effect) => {
  store.removeEffect({
    category: effect.type,
    data: {
      stepId: selectedNode.value.step.id
    }
  }, effect);
};

</script>

<template>
  <Dialog modal
          v-model:visible="store.getEffectState.showModal"
          header="Edit effects"
          :style="{ width: '25rem' }"
  >
    <div class="content">
      <div class="effect-list">
        <EffectBadgeComponent v-for="effect in filteredEffectList" :key="effect"
                              :effect="effect"
                              :removable="true"
                              :remove="() => removeEffect(effect)"
        />
      </div>
      <FloatLabel>
          <Select v-model="selectedNode"
                  id="node"
                  :options="nodes"
                  placeholder="Select a step"
                  class="w-full"
          >
            <template #value="{ value, placeholder }">
              <span v-if="value">
                <b>{{ value.step.label }}</b> - {{ value.step.description }}
              </span>
              <span v-else>
                {{ placeholder }}
              </span>
            </template>
            <template #option="{ option }">
              <span>{{ option.step.label }} {{ option.step.description }}</span>
            </template>
          </Select>
        <label for="effectTypes">Step</label>
      </FloatLabel>
      <FloatLabel>
        <Select v-model="selectedEffectType"
                id="effectTypes"
                :options="effectCategories"
                optionLabel="name"
                placeholder="Select an effect type"
                class="w-full"
        >
          <template #value="slotProps">
            <div v-if="slotProps.value" class="flex items-center">
              <img :alt="slotProps.value.name"
                   :src="slotProps.value.icon"
                   class="mr-2"
                   style="width: 18px"
              />
              <span>{{ slotProps.value.name }}</span>
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
              <span>{{ slotProps.option.name }}</span>
            </div>
          </template>
        </Select>
        <label for="effectTypes">Effect type</label>
      </FloatLabel>
      <CompletionEffectModal v-if="selectedEffectType?.type === EffectTypeEnum.Completion" :node="selectedNode" />
      <ItemEffectModal v-if="selectedEffectType?.type === EffectTypeEnum.Item" :node="selectedNode" />
      <SkillEffectModal v-if="selectedEffectType?.type === EffectTypeEnum.Skill" :node="selectedNode" />
    </div>
  </Dialog>
</template>

<style scoped>
  .content {
    display: flex;
    flex-direction: column;
    gap: 2rem;

    .effect-list {
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
      justify-content: center;
      & > * {
        width: auto;
      }
    }

    * {
      width: 100%;
    }
  }
</style>