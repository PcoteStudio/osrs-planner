<script setup lang="ts">
import StepComponent from "@/components/StepComponent.vue";
import type {StepModel} from "@/models/stepModel";

const props = defineProps<{
  nodes: Steptree[];
  indexPrefix?: string;
}>();

let prefix = '';
if (props.indexPrefix) {
  prefix = props.indexPrefix + '.';
}

</script>

<template>
<div class="task-list">
  <ol>
    <li v-for="(node, index) in nodes">
      <StepComponent :index="prefix + (index + 1)" :node="node" />
    </li>
  </ol>
</div>
</template>

<style scoped>
#stepsRoot {
  & > ol {
    padding-right: 1.2rem;
  }
}

.task-list {
  background-color: var(--color-background-soft);
  width: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  scrollbar-color: #222222 #111111;

  ol {
    //outline: green 1px solid;
    list-style-type: none;
    padding-left: 0;
    display: flex;
    flex-direction: column;
    width: inherit;
  }
}
</style>