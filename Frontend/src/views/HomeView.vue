<script setup lang="ts">
import Inventory from '@/components/EquipmentComponent.vue';
import StepList from '@/components/StepListComponent.vue';
import { useGlobalStore } from '@/stores/globalStore';
import DebugComponent from "@/components/DebugComponent.vue";

const state = useGlobalStore();
state.currentRoute.initializeSomeSteps();
let nodes = state.currentRoute.rootNode;

//TODO: Current step is set to the 1st step for testing
state.setCurrentStep(state.currentRoute.getCurrentStep());

</script>

<template>
  <main>
    <StepList :nodes="nodes.children" id="stepsRoot" class="first-child" />
    <Inventory />
    <DebugComponent />
  </main>
</template>

<style scoped>
main {
  display: flex;
  gap: 0.5rem;
  width: 100%;
  height: 100%;
  * {
    border: darkred solid 1px;
  }

  #stepsRoot {
    width: 350px;
  }
}
</style>
