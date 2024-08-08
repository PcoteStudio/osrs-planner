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
import ImportExportModalComponent from '@/components/ImportExportModalComponent.vue';
import StepModalComponent from '@/components/StepModalComponent.vue';
import { useToast } from 'primevue/usetoast';

const toast = useToast();
const state = useGlobalStore();

state.currentRoute.initializeSomeSteps();

const rootNode = ref(state.currentRoute.rootNode.children);

//TODO: Current step is set to the 1st step for testing
state.setCurrentNode(state.currentRoute.currentNode);

state.$onAction(
    ({
       name, // name of the action
       args, // array of parameters passed to the action
       after, // hook after the action returns or resolves
       onError, // hook if the action throws or rejects
     }) => {

      after((result) => {
        const details = getDetails(name, args, result, null);
        if (details.success) {
          toast.add({
            severity: 'info',
            detail: details.success,
            life: 5000
          });
        }
      });
      onError((error) => {
        const details = getDetails(name, args, null, error);
        if (details.error) {
          toast.add({
            severity: 'error',
            detail: details.error
          });
        }
        console.log(error);
      });
    }
);

const getDetails = (name: string, args: any[], success: any, error: any) => {
  let details = {
    success: '',
    error: '',
  };

  switch (name) {
    case 'addEffect':
      details.success = `New effect added: "${args[1].toString()}" to step ${args[0].step.toString()}`;
      details.error = `Error while adding effect: "${args[1].toString()}" to step ${args[0].step.toString()}`;
      break;
    case 'removeEffect':
      details.success = `Effect removed: "${args[1].toString()}" from step ${args[0].step.toString()}`;
      details.error = `Error while removing effect: "${args[1].toString()}" from step ${args[0].step.toString()}`;
      break;
    case 'toggleCompleted':
      details.success = `Step ${args[0].step.toString()}: ${args[0].step.completed ? 'Completed' : 'Incomplete'}`;
      details.error = `Error while changing the state of step: ${args[0].step.toString()} to ${args[0].step.completed ? 'Completed' : 'Incomplete'}`;
      break;
  }

  return details;
};

</script>

<template>
  <main>
    <!-- Special components -->
    <Toast />

    <!--  Modals  -->
    <AddEffectModalComponent />
    <ImportExportModalComponent />
    <StepModalComponent />

    <!--  Regular components  -->
    <TabComponent :min-width="'24rem'" max-width="30rem">
      <StepList :nodes="rootNode" id="stepsRoot" class="first-child" />
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
