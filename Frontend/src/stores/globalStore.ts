import { defineStore } from 'pinia';
import { Route } from '@/models/route';
import type { StepTreeNode } from '@/models/route';
import { PlayerState } from '@/models/playerState';
import type { Step } from '@/models/step';

export const useGlobalStore = defineStore('globalStore', {
    state: () => {
        const playerState : PlayerState = new PlayerState();

        const currentRoute = new Route();
        currentRoute.playerState = playerState;

        return {
            currentRoute: currentRoute,
            currentPlayerState: playerState,
            currentWarnings: playerState.warnings,
        };
    },
    actions: {
        setCurrentStep(step: Step) {
            this.currentRoute.setCurrentStep(step);
        },
        toggleCompleted(node: StepTreeNode) {
            if (!node.step) {
                throw new Error(`Error: node should have a step assigned to toggle the status: ${node}`);
            }
            node.step.completed = !node.step.completed;

            function toggleChildren(parent: StepTreeNode, isCompleted: boolean) {
                for (const child of parent.children) {
                    if (child.children.length > 0) {
                        toggleChildren(child, isCompleted);
                    }
                    if (!child.step) {
                        throw new Error(`Error: node should have a step assigned to toggle the status: ${node}`);
                    }
                    child.step.completed = isCompleted;
                }
            }

            toggleChildren(node, node.step.completed);

            // Set current step to the next step
            if (this.currentRoute.getCurrentStep() === node.step) {
                do {
                    this.currentRoute.stepOnce();
                } while (this.currentRoute.getCurrentStep()?.completed);
            }
        }
    },
});