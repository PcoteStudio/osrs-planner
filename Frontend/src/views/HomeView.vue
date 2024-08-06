<script setup lang="ts">
import EquipmentComponent from '@/components/EquipmentComponent.vue';
import StepList from '@/components/StepListComponent.vue';
import { useGlobalStore } from '@/stores/globalStore';
import DebugComponent from '@/components/DebugComponent.vue';
import InventoryComponent from '@/components/SkillTabComponent.vue';
import { ref } from 'vue';
import AddEffectModalComponent from '@/components/AddEffectModalComponent.vue';

const state = useGlobalStore();
state.currentRoute.initializeSomeSteps();

const rootNode = ref(state.currentRoute.rootNode);

//TODO: Current step is set to the 1st step for testing
state.setCurrentNode(state.currentRoute.currentNode);

</script>

<template>
  <main>
    <AddEffectModalComponent />
    <StepList :nodes="rootNode.children" id="stepsRoot" class="first-child" />
    <EquipmentComponent />
    <InventoryComponent />
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
