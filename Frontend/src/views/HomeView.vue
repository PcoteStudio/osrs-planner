<script setup lang="ts">
import EquipmentComponent from '@/components/EquipmentComponent.vue';
import StepList from '@/components/StepListComponent.vue';
import { useGlobalStore } from '@/stores/globalStore';
import DebugComponent from '@/components/DebugComponent.vue';
import SkillTabComponent from '@/components/SkillTabComponent.vue';
import { onMounted } from 'vue';
import AddEffectModalComponent from '@/components/EffectModalComponent.vue';
import TabComponent from '@/components/TabComponent.vue';
import ControlPanelComponent from '@/components/ControlPanelComponent.vue';
import ImportExportModalComponent from '@/components/ImportExportModalComponent.vue';
import NotificationComponent from '@/components/Notification/NotificationComponent.vue';

const store = useGlobalStore();

store.getCurrentRoute.initializeSomeSteps();

//TODO: Current step is set to the 1st step for testing
onMounted(() => {
  const currentStep = store.getCurrentRoute.getCurrentStep();
  if (currentStep)
    store.setCurrentNode(currentStep.id);

  store.currentRoute.getPlayerState().inventory.initializeSomeSlots();
});
</script>

<template>
  <main>
    <!-- Special components -->
    <NotificationComponent />

    <!--  Modals  -->
    <AddEffectModalComponent />
    <ImportExportModalComponent />

    <!--  Regular components  -->
    <TabComponent :min-width="'36rem'" max-width="30rem">
      <StepList :nodes="store.getNodeTree" id="stepsRoot" class="first-child" :editable="store.getStepState.isEditing" />
    </TabComponent>
    <TabComponent :min-width="'16rem'">
      <InventoryComponent />
    </TabComponent>
    <TabComponent :max-width="'24rem'">
      <ControlPanelComponent />
    </TabComponent>
    <TabComponent :min-width="'24rem'">
      <DebugComponent />
    </TabComponent>
    <TabComponent :max-width="'20rem'">
      <EquipmentComponent />
    </TabComponent>
    <TabComponent :max-width="'20rem'">
      <SkillTabComponent />
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
