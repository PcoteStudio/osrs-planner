<script setup lang="ts">
import EquipmentComponent from '@/components/EquipmentComponent.vue';
import StepList from '@/components/StepListComponent.vue';
import { useGlobalStore } from '@/stores/globalStore';
import DebugComponent from '@/components/DebugComponent.vue';
import InventoryComponent from '@/components/SkillTabComponent.vue';
import { ref } from 'vue';
import AddEffectModalComponent from '@/components/AddEffectModalComponent.vue';
import TabComponent from '@/components/TabComponent.vue';
import ControlPanelComponent from '@/components/ControlPanelComponent.vue';

const state = useGlobalStore();
state.currentRoute.initializeSomeSteps();

const rootNode = ref(state.currentRoute.rootNode);

//TODO: Current step is set to the 1st step for testing
state.setCurrentNode(state.currentRoute.currentNode);

</script>

<template>
  <main>
    <AddEffectModalComponent />
    <TabComponent :min-width="'24rem'" max-width="30rem">
      <StepList :nodes="rootNode.children" id="stepsRoot" class="first-child" />
    </TabComponent>
    <TabComponent :max-width="'24rem'">
      <ControlPanelComponent />
    </TabComponent>
    <TabComponent :max-width="'20rem'">
      <EquipmentComponent />
    </TabComponent>
    <TabComponent :max-width="'20rem'">
      <InventoryComponent />
    </TabComponent>
    <TabComponent>
      <DebugComponent />
    </TabComponent>
  </main>
</template>

<style scoped>
main {
  display: flex;
  gap: 0.5rem;
  width: 100%;
  height: 100vh;
  overflow-y: hidden;

  @media screen and (max-width: 450px) {
    flex-wrap: wrap;
    overflow-y: auto;
    justify-content: center;
  }
}
</style>
