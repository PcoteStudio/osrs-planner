import { defineStore } from 'pinia';
import { RootStepTreeNode, StepTreeNode } from '@/models/stepTreeNode';
import { Route } from '@/models/route';
import { PlayerState } from '@/models/playerState';
import { SkillsEnum } from '@/models/skill/skillsEnum';
import { Effect, EffectTypeEnum } from '@/models/effect';
import { type Notification } from '@/components/Notification/notificationTypes';
import { parseRouteJson } from '@/models/apiHelper/jsonApiHelper';
import { SkillEffect } from '@/models/skill/skillEffect';

export const useGlobalStore = defineStore('globalStore', {
    state: () => {
        const playerState: PlayerState = new PlayerState();
        const currentRoute : Route = new Route();
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
            showModal: false,
        };

        const notifications: Notification[] = [];

        return {
            currentRoute: currentRoute,
            effectState: effectState,
            importExportState: importExportState,
            stepState: stepState,
            notifications: notifications
        };
    },
    getters: {
        getImportExportState: (state) => {
            return state.importExportState;
        },
        getEffectState: (state) => {
            return state.effectState;
        },
        getCurrentRoute: (state) => {
            return state.currentRoute;
        },
        getNodeList: (state) : StepTreeNode[] => {
            return state.currentRoute.rootNode.toFlatList();
        },
        getNodeById: (state) => {
            return (nodeId: string) : StepTreeNode | undefined =>
                state.currentRoute.rootNode.findNodeById(nodeId);
        },
        getCurrentSkillExp: (state) => {
            return (skill: SkillsEnum) : number => state.currentRoute.getPlayerState().getSkillExperience(skill);
        },
        findEffect: (state) => {
            return (nodeId: string, effectType: EffectTypeEnum, skillType?: SkillsEnum) : Effect | undefined => {
                const node = state.currentRoute.rootNode.findRequiredNodeById(nodeId);

                switch (effectType) {
                    case EffectTypeEnum.Skill: {
                        return node.step.effects.find(
                            e => e instanceof SkillEffect && e.skill === skillType
                        );
                    }
                }
            };
        },
        getCurrentSkills: (state) => {
            return state.currentRoute.getPlayerState().skills;
        },
    },
    actions: {
        setCurrentNode(nodeId : string) {
            const node = this.currentRoute.rootNode.findRequiredNodeById(nodeId);

            this.currentRoute.setCurrentNode(node);
        },
        setCurrentRoute(newRoute: Route) {
            this.currentRoute = newRoute;
            this.currentRoute.setCurrentNode(this.currentRoute.getFirstNode());

            const nbSteps = newRoute.getStepCount(this.currentRoute.rootNode as RootStepTreeNode);

            this.addNotification({
                action: 'setCurrentRoute',
                data: {
                    nbSteps: nbSteps
                }
            });
        },
        toggleCompleted(nodeId: string) {
            const node = this.currentRoute.rootNode.findRequiredNodeById(nodeId);

            this.currentRoute.toggleNodeCompletion(node);

            // Set current step to the next step
            if (this.currentRoute.getCurrentStep() === node.step) {
                do {
                    this.currentRoute.stepOnce();
                } while (this.currentRoute.getCurrentStep()?.completed);
            }

            this.addNotification({
                action: 'toggleCompleted',
                data: {
                    stepLabel: node.step.label,
                    completed: node.step.completed,
                }
            });
        },
        addNotification(notification: Notification) {
            this.notifications.push(notification);
        },
        clearNotifications() {
            if (this.notifications.length > 0)
                this.notifications = [];
        },
        addEffect(nodeId: string, newEffect: Effect) {
            const node = this.currentRoute.rootNode.findRequiredNodeById(nodeId);

            this.currentRoute.addEffect(node, newEffect);

            this.addNotification({
                action: 'addEffect',
                data: {
                    effect: newEffect,
                    stepLabel: node.step.label
                }
            });
        },
        removeEffect(nodeId: string, effect: Effect) {
            const node = this.currentRoute.rootNode.findRequiredNodeById(nodeId);

            this.currentRoute.removeEffect(node, effect);

            this.addNotification({
                action: 'removeEffect',
                data: {
                    effect: effect,
                    stepLabel: node.step.label
                }
            });
        },
        openEffectModal(nodeId?: string, skill?: SkillsEnum) {
            if (nodeId)
                this.effectState.node = this.currentRoute.rootNode.findRequiredNodeById(nodeId);
            else
                this.effectState.node = this.currentRoute.currentNode;

            this.effectState.type = undefined;
            this.effectState.skill = undefined;

            if (skill) {
                this.effectState.type = EffectTypeEnum.Skill;
                this.effectState.skill = skill;
            }
            this.effectState.showModal = true;
        },
        closeEffectModal() {
            this.effectState.showModal = false;
        },
        openImportExportModal(type?: string) {
            this.importExportState.type = type;
            this.importExportState.showModal = true;
        },
        closeImportExportModal() {
          this.importExportState.showModal = false;
        },
        importRoute(data: string) {
            const newRoute = parseRouteJson(data);
            this.setCurrentRoute(newRoute);
        }
    },
});