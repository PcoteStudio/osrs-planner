import { defineStore } from 'pinia';
import { Route } from '@/models/route';
import type { StepTreeNode } from '@/models/route';
import { PlayerState } from '@/models/playerState';
import type { Step } from '@/models/step';

export const useGlobalStore = defineStore('globalStore', {
    state: () => {
        const playerState: PlayerState = new PlayerState();
        const currentStep: Step | undefined = undefined;

        const currentRoute = new Route();
        currentRoute.playerState = playerState;

        return {
            currentRoute: currentRoute,
            currentPlayerState: playerState,
            currentWarnings: playerState.warnings,
            currentStep: currentStep as Step | undefined,
        };
    },
    actions: {
        setCurrentStep(step: Step) {
            this.currentStep = step;
        },
        toggleCompleted(node: StepTreeNode) {
            node.step.completed = !node.step.completed;

            function toggleChildren(parent: StepTreeNode, isCompleted: boolean) {
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