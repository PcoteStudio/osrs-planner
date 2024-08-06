import { defineStore } from 'pinia';
import { Route } from '@/models/route';
import type { StepTreeNode } from '@/models/route';
import { PlayerState } from '@/models/playerState';
import type { SkillsEnum } from '@/models/skill/skillsEnum';

export const useGlobalStore = defineStore('globalStore', {
    state: () => {
        const playerState: PlayerState = new PlayerState();
        const currentRoute = new Route();
        currentRoute.playerState = playerState;

        return {
            currentRoute: currentRoute,
            currentPlayerState: playerState,
            currentWarnings: playerState.warnings,
            showEffectModal: false,
        };
    },
    actions: {
        setCurrentNode(node: StepTreeNode | undefined) {
            this.currentRoute.setCurrentNode(node);
        },
        toggleCompleted(node: StepTreeNode) {
            this.currentRoute.toggleNodeCompletion(node);
            this.currentRoute.rootNode;

            // Set current step to the next step
            if (this.currentRoute.getCurrentStep() === node.step) {
                do {
                    this.currentRoute.stepOnce();
                } while (this.currentRoute.getCurrentStep()?.completed);
            }
        },
        addEffect(skill: SkillsEnum) {
            console.log('Add effect : ' + skill);
            this.showEffectModal = true;
        }
    },
});