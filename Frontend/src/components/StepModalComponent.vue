<script setup lang="ts">
import { useGlobalStore } from '@/stores/globalStore';
import { computed, ref } from 'vue';
import type { StepTreeNode } from '@/models/stepTreeNode';
import type { Effect } from '@/models/effect';
import type { TreeTableFilterMeta } from 'primevue/treetable';
import EffectBadgeComponent from '@/components/EffectBadgeComponent.vue';

const state = useGlobalStore();

const filters = ref({});

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
    data: {
      ...node.step,
      stringEffects: node.step?.effects.map(e => e.toString()).join(','),
      stepNode: node,
    },
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

const postFilter = (event: TreeTableFilterMeta) => {
  console.log(event);
};

</script>

<template>
  <Dialog modal
          v-model:visible="state.stepState.showModal"
          header="Steps"
          :style="{ width: '50rem' }"
  >
    <template #container="{ closeCallback }">
      <div class="content">
        <TreeTable :value="nodes"
                   :filters="filters"
                   size="small"
                   @filter="postFilter"
                   class="flex flex-col overflow-hidden"
        >
          <template #header>
            <div class="flex justify-between">
              <span class="p-dialog-title">Steps</span>
              <IconField>
                <InputIcon class="pi pi-search" />
                <InputText v-model="filters['global']" placeholder="Search" />
              </IconField>
              <Button @click="closeCallback"
                      icon="pi pi-times"
                      rounded
                      aria-label="Close"
                      severity="secondary"
                      class="p-dialog-header-actions"
              />
            </div>
          </template>
          <Column field="label" header="Step" :style="{ paddingRight: 0 }"></Column>
          <Column expander :style="{ padding: 0 }"></Column>

          <Column field="description" key="description" header="Description" :style="{ width: '40%' }">
            <template #body="{ node, column }">
              {{ node.data[column.key] }}
            </template>
            <!--            <template #editor="{ node, column }">-->
            <!--              <InputText v-model="node[column.key]" autofocus fluid />-->
            <!--            </template>-->
          </Column>

          <Column field="effects" key="effects" filterField="stringEffects" header="Effects" :style="{ width: '40%' }">
            <template #body="{ node, column }">
              <div class="flex flex-wrap gap-1 items-center">
                <EffectBadgeComponent
                    v-for="(effect, index) in node.data[column.key]"
                    :key="index"
                    :effect="effect"
                    :removable="true"
                    :command="() => removeEffect(node.data['stepNode'], effect)"
                />
                <Button type="button" icon="pi pi-plus" rounded severity="primary" outlined
                        :style="{ height: '2em', width: '2em', fontSize: '0.9em'}" size="small"
                        @click="addEffect(node.data['stepNode'])"
                />
              </div>
            </template>
          </Column>

          <Column :style="{ width: '10%' }">
            <template #body="{ node }">
              <Button rounded
                      size="small"
                      :severity="node.data['completed'] ? 'primary' : 'secondary'"
                      icon="pi pi-check"
                      @click="toggleCompleted(node.data['stepNode'])"
              />
              <Button type="button" icon="pi pi-pencil" rounded severity="secondary" />
            </template>
          </Column>
        </TreeTable>
      </div>
    </template>
  </Dialog>
</template>

<style scoped>
  .content {
    padding: 1.25rem;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }
</style>