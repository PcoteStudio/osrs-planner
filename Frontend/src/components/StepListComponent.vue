<script setup lang="ts">
import StepComponent from '@/components/StepComponent.vue';
import { StepTreeNode } from '@/models/stepTreeNode';

const props = withDefaults(defineProps<{
  nodes: StepTreeNode[];
  editable?: boolean;
}>(), {
  editable: false,
});

</script>

<template>
  <div class="container">
    <div class="task-list">
      <ol>
        <li :key="index" v-for="(node, index) in nodes">
          <StepComponent :index="node.step.label" :node="node" :editable="editable" />
        </li>
      </ol>
    </div>
  </div>
</template>

<style scoped>
#stepsRoot {
  & > .task-list {
    overflow-y: auto;
  }

  & > ol {
    padding-right: 1.2rem;
  }
}

.container {
  display: grid;
  grid-template-rows: 1fr;
  transition: grid-template-rows 1s ease-in-out, opacity 1s ease-in-out;
  flex-shrink: 1;
  height: inherit;
}

.task-list {
  overflow: hidden;

  ol {
    list-style-type: none;
    padding-left: 0;
    display: flex;
    flex-direction: column;
    width: inherit;
  }
}
</style>