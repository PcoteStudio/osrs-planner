import { defineStore } from 'pinia';
import { RootStepTreeNode, StepTreeNode } from '@/models/stepTreeNode';
import { Route } from '@/models/route';
import { PlayerState } from '@/models/playerState';
import { SkillsEnum } from '@/models/skill/skillsEnum';
import { Effect, EffectTypeEnum } from '@/models/effect';
import { type Notification } from '@/components/Notification/notificationTypes';

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
            showModal: false,
        };

        const notifications: Notification[] = [];

        return {
            currentRoute: currentRoute,
            currentPlayerState: playerState,
            currentWarnings: playerState.warnings,
            effectState: effectState,
            importExportState: importExportState,
            stepState: stepState,
            notifications: notifications
        };
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
        openImportExportModal(type?: string) {
            this.importExportState.type = type;
            this.importExportState.showModal = true;
        },
    },
});