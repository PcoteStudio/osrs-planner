<script setup lang="ts">
import Dialog from 'primevue/dialog';
import Select from 'primevue/select';

import { useGlobalStore } from '@/stores/globalStore';
import { computed, ref, watch } from 'vue';
import { EffectTypeEnum, getEffectTypes } from '@/models/effect';
import SkillEffectModal from '@/components/SkillEffectModal.vue';
import type { StepTreeNode } from '@/models/stepTreeNode';

const state = useGlobalStore();

const selectedEffectType = ref();
const selectedNodeKey = ref();

const title = computed(() => {
  if (selectedEffectType.value)
    return `Add ${selectedEffectType.value?.name} Effect`;
  return 'Add Effect';
});

const effectTypes = computed(() => getEffectTypes());
const nodes = computed(() => state.currentRoute.rootNode.children.map(n => getRouteNodes(n)));
const selectedNode = computed(() => nodes.value.find(n =>
    selectedNodeKey.value &&
    Object.keys(selectedNodeKey.value).length > 0 &&
    n.key === Object.keys(selectedNodeKey.value)[0]).value
);

const getRouteNodes = (node: StepTreeNode) : any[] => {
  let children = [];
  if (node.children) {
    for (const child of node.children) {
      children.push(getRouteNodes(child));
    }
  }

  return {
    key: node.step?.id,
    label: `${node.step?.label} - ${node.step?.description}`,
    value: node,
    children,
  };
};

const setNodeKey = (node: StepTreeNode) => {
  const defaultValue = {};
  if (node?.step?.id)
    defaultValue[node?.step?.id] = true;
  else if (state.currentRoute.currentNode?.step?.id)
    defaultValue[state.currentRoute.currentNode?.step?.id] = true;

  return defaultValue;
};

watch(state.effectState, (effectState) => {
  selectedEffectType.value = effectTypes.value.find(e => e.type === effectState.type);
  selectedNodeKey.value = setNodeKey(effectState.node);
}, { immediate: true });
</script>

<template>
  <Dialog modal
          v-model:visible="state.effectState.showModal"
          :header="title"
          :style="{ width: '25rem' }"
  >
    <div class="content">
      <FloatLabel>
        <TreeSelect v-model="selectedNodeKey"
                id="node"
                :options="nodes"
                optionLabel="name"
                placeholder="Select an step"
                class="w-full"
        ></TreeSelect>
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
        <label for="effectTypes">Effect type</label>
      </FloatLabel>
      <SkillEffectModal v-if="selectedEffectType?.type === EffectTypeEnum.Skill" :node="selectedNode" />
    </div>
  </Dialog>
</template>

<style scoped>
  .content {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    margin-top: 1.5em;

    * {
      width: 100%;
    }
  }
</style>