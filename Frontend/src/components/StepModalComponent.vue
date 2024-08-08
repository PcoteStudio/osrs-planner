<script setup lang="ts">
import { useGlobalStore } from '@/stores/globalStore';
import { computed, ref } from 'vue';
import type { StepTreeNode } from '@/models/stepTreeNode';
import EffectBadgeComponent from '@/components/EffectBadgeComponent.vue';
import type { Effect } from '@/models/effect';

const state = useGlobalStore();

const selectedStep = ref(null);

const nodes = computed(() => {
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
      ...node
    },
    children
  };
};

const addEffect = () => {
  state.openEffectModal();
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
        <Column field="index" header="Step" :style="{ paddingRight: 0 }"></Column>
        <Column expander :style="{ padding: 0 }"></Column>
        <Column field="step.description" header="Description"></Column>
        <Column field="step.effects" header="Effects">
          <template #body="data">
            <div class="flex flex-wrap gap-1 items-center">
<!--              FIXME: 2 elements from the list are removed, it is only the displayed values that are impacted, the model behind has the right value removed-->
              <EffectBadgeComponent
                  v-for="(effect, index) in data.node.data.step.effects"
                  :key="index"
                  :effect="effect"
                  :removable="true"
                  :command="() => removeEffect(data.node.data, effect)"
              />
              <Button type="button" icon="pi pi-plus" rounded severity="primary" outlined
                      :style="{ height: '2em', width: '2em', fontSize: '0.9em'}" size="small"
                      @click="addEffect(data.node.data.step)"
              />
            </div>
          </template>
        </Column>
        <Column>
          <template #body="data">
              <Button rounded
                      size="small"
                      :severity="data.node.data.step.completed ? 'primary' : 'secondary'"
                      icon="pi pi-check"
                      @click="toggleCompleted(data.node.data)"
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