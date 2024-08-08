import { defineStore } from 'pinia';
import { StepTreeNode } from '@/models/stepTreeNode';
import { Route } from '@/models/route';
import { PlayerState } from '@/models/playerState';
import { SkillsEnum } from '@/models/skill/skillsEnum';
import { Effect, EffectTypeEnum } from '@/models/effect';

export const useGlobalStore = defineStore('globalStore', {
    state: () => {
        const playerState: PlayerState = new PlayerState();
        const currentRoute = new Route();
        currentRoute.playerState = playerState;

        const effectState = {
            showModal: false,
            type: '',
            skill: undefined as SkillsEnum | undefined,
        };

        const importExportState = {
            showModal: false,
            type: undefined as string | undefined,
        };

        const stepState = {
            showModal: false,
        };

        return {
            currentRoute: currentRoute,
            currentPlayerState: playerState,
            currentWarnings: playerState.warnings,
            effectState: effectState,
            importExportState: importExportState,
            stepState: stepState,
        };
    },
    actions: {
        setCurrentNode(node: StepTreeNode | undefined) {
            this.currentRoute.setCurrentNode(node);
        },
        toggleCompleted(node: StepTreeNode) {
            this.currentRoute.toggleNodeCompletion(node);

            // Set current step to the next step
            if (this.currentRoute.getCurrentStep() === node.step) {
                do {
                    this.currentRoute.stepOnce();
                } while (this.currentRoute.getCurrentStep()?.completed);
            }
        },
        openEffectModal(skill?: SkillsEnum) {
            if (skill) {
                this.effectState.type = EffectTypeEnum.Skill;
                this.effectState.skill = skill;
            }
            this.effectState.showModal = true;
        },
        addEffect(node: StepTreeNode | undefined, newEffect: Effect) {
            if (!node)
                throw new Error('Cannot assign effect to undefined node.');

            node.step?.addEffect(newEffect);
            this.currentRoute.invalidateNextNodes(node);
            this.currentRoute.setCurrentNode(this.currentRoute.currentNode);
        },
        removeEffect(node: StepTreeNode, effect: Effect) {
            node.step?.removeEffect(effect);
            this.currentRoute.invalidateNextNodes(node);
            this.currentRoute.setCurrentNode(this.currentRoute.currentNode);
        },
        openImportExportModal(type?: string) {
            this.importExportState.type = type;
            this.importExportState.showModal = true;
        },
    },
});