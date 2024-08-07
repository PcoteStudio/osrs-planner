<script setup lang="ts">
import { useGlobalStore } from '@/stores/globalStore';
import { onMounted, ref } from 'vue';
import type { StepTreeNode } from '@/models/stepTreeNode';
import log from 'loglevel';
import EffectBadgeComponent from '@/components/EffectBadgeComponent.vue';
import { getSkillStyle, SkillsEnum } from '@/models/skill/skillsEnum';
import { formatExperience } from '@/utils/formaters';

const state = useGlobalStore();

const selectedStep = ref(null);

const stepNodes = ref();
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

stepNodes.value = state.currentRoute.rootNode.children.map((e, index) => getRouteNodes(e, index + 1));
console.log(stepNodes.value);
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
            <div class="flex flex-wrap gap-1">
              <EffectBadgeComponent
                  v-for="(effect, index) in data.node.data.effects"
                  :key="index"
                  :effect="effect"
                  :removable="true"
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