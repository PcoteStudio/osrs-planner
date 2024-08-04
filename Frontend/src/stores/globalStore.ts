import { defineStore } from 'pinia';
import { RouteModel } from '@/models/routeModel';
import { PlayerStateModel } from '@/models/playerStateModel';
import { EquipmentModel } from '@/models/item/equipmentModel';
import type { StepModel } from '@/models/stepModel';

export const useGlobalStore = defineStore('globalStore', {
    state: () => {
        const playerState : PlayerStateModel = new PlayerStateModel();
        const currentStep: StepModel | undefined = undefined;

        const currentRoute = new RouteModel();
        currentRoute.playerState = playerState;

        return {
            currentRoute: currentRoute,
            currentPlayerState: playerState,
            currentWarnings: playerState.warnings,
            currentStep: currentStep,
        };
    },
    actions: {
        setCurrentStep(step: StepModel) {
            this.currentStep = step;
        },
        completeStep(step: StepModel) {
            this.currentRoute.steps.find(s => s.id === step.id).completed = true;

            if (this.currentStep === step) {
                do {
                    this.currentRoute.stepOnce();
                    this.currentStep = this.currentRoute.steps[this.currentRoute.currentStepIndex];
                } while (this.currentStep.completed);
            }
        }
    },
});