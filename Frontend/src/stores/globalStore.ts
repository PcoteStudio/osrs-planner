import { defineStore } from 'pinia';
import { RouteModel } from '@/models/routeModel';
import type { StepTreeNode } from '@/models/routeModel';
import { PlayerStateModel } from '@/models/playerStateModel';
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
            currentStep: currentStep as StepModel | undefined,
        };
    },
    actions: {
        setCurrentStep(step: StepModel) {
            this.currentStep = step;
        },
        toggleCompleted(node: StepTreeNode) {
            node.step.completed = !node.step.completed;

            function toggleChildren(parent: StepTreeNode,  isCompleted: boolean) {
                for (const child of parent.children) {
                    if (child.children.length > 0) {
                        toggleChildren(child, isCompleted);
                    }
                    child.step.completed = isCompleted;
                }
            }

            toggleChildren(node, node.step.completed);

            if (this.currentStep === node.step) {
                do {
                    this.currentRoute.stepOnce();
                    if (!this.currentRoute.currentStepIndex) {
                        throw new Error(`CurrentStepIndex is undefined in the currentRoute : ${this.currentRoute}`);
                    }
                    this.currentStep = this.currentRoute.steps[this.currentRoute.currentStepIndex];
                } while (this.currentStep.completed);
            }
        }
    },
});