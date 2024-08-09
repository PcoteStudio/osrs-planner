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
            node: undefined as StepTreeNode | undefined,
            type: undefined as EffectTypeEnum | undefined,
            skill: undefined as SkillsEnum | undefined,
        };

        const importExportState = {
            showModal: false,
            type: undefined as string | undefined,
        };

        const stepState = {
            showModal: true,
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
        openEffectModal(node: StepTreeNode | undefined, skill?: SkillsEnum) {
            this.effectState.node = node;
            this.effectState.type = undefined;
            this.effectState.skill = undefined;

            if (skill) {
                this.effectState.type = EffectTypeEnum.Skill;
                this.effectState.skill = skill;
            }
            this.effectState.showModal = false;
        },
        addEffect(node: StepTreeNode, newEffect: Effect) {
            this.currentRoute.addEffect(node, newEffect);
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