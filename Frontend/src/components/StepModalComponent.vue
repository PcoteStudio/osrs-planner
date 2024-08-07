<script setup lang="ts">
import { useGlobalStore } from '@/stores/globalStore';
import { computed, onMounted, ref } from 'vue';
import type { StepTreeNode } from '@/models/stepTreeNode';
import log from 'loglevel';
import EffectBadgeComponent from '@/components/EffectBadgeComponent.vue';
import { getSkillStyle, SkillsEnum } from '@/models/skill/skillsEnum';
import { formatExperience } from '@/utils/formaters';
import type { Step } from '@/models/step';

const state = useGlobalStore();

const selectedStep = ref(null);

const stepNodes = computed(() => {
  return state.currentRoute.rootNode.children.map((e, index) => getRouteNodes(e, index + 1));
});
const getRouteNodes = (node: StepTreeNode, key: string) => {
  let children = [];
  if (node.children) {
    let index = 0;
    for (const child of node.children) {
      index++;
      children.push(getRouteNodes(child, `${key}.${index}`));
    }
  }

  return {
    key,
    data: {
      index: key,
      ...node.step
    },
    children
  };
};

const addEffect = () => {
  state.openEffectModal();
};

const removeEffect = (effect: Effect) => {
  state.removeEffect(effect);
};

</script>

<template>
  <Dialog modal
          v-model:visible="state.stepState.showModal"
          header="Steps"
          :style="{ width: '50rem' }"
  >
    <div class="content">

      <TreeTable :value="stepNodes" size="small">
        <Column field="index" header="Step" :style="{ paddingRight: 0 }"></Column>
        <Column expander :style="{ padding: 0 }"></Column>
        <Column field="description" header="Description"></Column>
        <Column field="effects" header="Effects">
          <template #body="data">
            <div class="flex flex-wrap gap-1 items-center">
              <EffectBadgeComponent
                  v-for="(effect, index) in data.node.data.effects"
                  :key="index"
                  :effect="effect"
                  :removable="true"
                  :command="() => removeEffect(effect)"
              />
              <Button type="button" icon="pi pi-plus" rounded severity="primary" outlined
                      :style="{ height: '2em', width: '2em', fontSize: '0.9em'}" size="small"
                      @click="addEffect(data.node.data)"
              />
            </div>
          </template>
        </Column>
        <Column>
          <template #body="data">
              <Button rounded
                      size="small"
                      :severity="data.node.data.completed ? 'primary' : 'secondary'"
                      icon="pi pi-check"
              />
              <Button type="button" icon="pi pi-pencil" rounded severity="secondary" />
          </template>
        </Column>
      </TreeTable>
    </div>
  </Dialog>
</template>

<style scoped>

</style>