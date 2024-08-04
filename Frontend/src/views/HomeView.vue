<script setup lang="ts">
import Inventory from '@/components/EquipmentComponent.vue';
import StepList from "@/components/StepListComponent.vue";
import {useGlobalStore} from "@/stores/globalStore";
import {StepModel} from "@/models/stepModel";

const state = useGlobalStore();
state.currentRoute.initializeSomeSteps();
let nodes = state.currentRoute.toTree();

</script>

<template>
  <main>
    <StepList :nodes="nodes" id="stepsRoot" class="first-child" />
    <Inventory />
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
