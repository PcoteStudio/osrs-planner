<script setup lang="ts">
import Dialog from 'primevue/dialog';
import Select from 'primevue/select';

import { useGlobalStore } from '@/stores/globalStore';
import { computed, ref, watch } from 'vue';
import { EffectTypeEnum, getEffectTypes } from '@/models/effect';
import SkillEffectModal from '@/components/SkillEffectModal.vue';
import CompletionEffectModal from '@/components/CompletionEffectModal.vue';
import ItemEffectModal from '@/components/ItemEffectModal.vue';
import EffectBadgeComponent from '@/components/EffectBadgeComponent.vue';

const store = useGlobalStore();

const selectedEffectType = ref();
const selectedNode = ref();

const effectTypes = computed(() => getEffectTypes());
const nodes = ref(store.getNodeList);
const effectList = computed(() => nodes.value.find(n => n.step.id === selectedNode.value.step.id)?.step.effects);

const showModal = computed(() => store.getEffectState.showModal);
watch(showModal, () => {
  if (!showModal.value)
    return;

  selectedEffectType.value = effectTypes.value.find(e => e.type === store.getEffectState.type);
  selectedNode.value = store.getEffectState.node || store.getCurrentRoute.currentNode;
}, { immediate: true });

</script>

<template>
  <Dialog modal
          v-model:visible="store.getEffectState.showModal"
          header="Edit effects"
          :style="{ width: '25rem' }"
  >
    <div class="content">
      <div class="effect-list">
        <EffectBadgeComponent v-for="effect in effectList" :key="effect"
                              :effect="effect"
                              :removable="true"
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
                :options="effectTypes"
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