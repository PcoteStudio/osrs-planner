<script setup lang="ts">
import { useGlobalStore } from '@/stores/globalStore';
import { computed, ref } from 'vue';
import type { StepTreeNode } from '@/models/stepTreeNode';
import type { Effect } from '@/models/effect';

const state = useGlobalStore();

const nodes = computed(() => {
  return state.currentRoute.rootNode.children.map(e => getRouteNodes(e));
});
const getRouteNodes = (node: StepTreeNode) => {
  let children = [];
  if (node.children) {
    for (const child of node.children) {
      children.push(getRouteNodes(child));
    }
  }

  return {
    key: node.step?.id,
    ...node.step,
    node,
    children,
  };
};

const addEffect = (node: StepTreeNode) => {
  state.openEffectModal(node);
};

const removeEffect = (node: StepTreeNode, effect: Effect) => {
  state.removeEffect(node, effect);
};

const toggleCompleted = (node: StepTreeNode) => {
  state.toggleCompleted(node);
};

</script>

<template>
  <Dialog modal
          v-model:visible="state.stepState.showModal"
          header="Steps"
          :style="{ width: '50rem' }"
  >
    <div class="content">
      <TreeTable :value="nodes" size="small">
        <Column field="label" key="label" header="Step" :style="{ paddingRight: 0 }" >
          <template #body="{ node, column }">
            {{ node[column.key] }}
          </template>
        </Column>
        <Column expander :style="{ padding: 0 }"></Column>

        <Column field="description" key="description" header="Description" :style="{ width: '40%' }">
          <template #body="{ node, column }">
            {{ node[column.key] }}
          </template>
          <template #editor="{ node, column }">
            <InputText v-model="node[column.key]" autofocus fluid />
          </template>
        </Column>

        <Column field="effects" key="effects" header="Effects" :style="{ width: '40%' }">
          <template #body="{ node, column }">
            <div class="flex flex-wrap gap-1 items-center">
              <EffectBadgeComponent
                  v-for="(effect, index) in node[column.key]"
                  :key="index"
                  :effect="effect"
                  :removable="true"
                  :command="() => removeEffect(node.node, effect)"
              />
              <Button type="button" icon="pi pi-plus" rounded severity="primary" outlined
                      :style="{ height: '2em', width: '2em', fontSize: '0.9em'}" size="small"
                      @click="addEffect(node.node)"
              />
            </div>
          </template>
        </Column>

        <Column :style="{ width: '10%' }">
          <template #body="{ node }">
            <Button rounded
                    size="small"
                    :severity="node.completed ? 'primary' : 'secondary'"
                    icon="pi pi-check"
                    @click="toggleCompleted(node.node)"
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