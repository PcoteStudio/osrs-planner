import { defineStore } from 'pinia';
import { type BaseStepTreeNode, StepTreeNode } from '@/models/stepTreeNode';
import { Route } from '@/models/route';
import { PlayerState } from '@/models/playerState';
import { SkillsEnum } from '@/models/skill/skillsEnum';
import { Effect, EffectTypeEnum } from '@/models/effect';

type Notification =
    AddEffectNotification
    | RemoveEffectNotification
    | toggleCompleted
    ;
type AddEffectNotification = {
    action: 'addEffect';
    data: {
        effect: Effect;
        stepLabel: string;
    }
}

type RemoveEffectNotification = {
    action: 'removeEffect';
    data: {
        effect: Effect;
        stepLabel: string;
    }
}

type toggleCompleted = {
    action: 'toggleCompleted';
    data: {
        stepLabel: string;
        completed: boolean;
    }
}

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
            //TODO: Add log when imported
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

            node.step.addEffect(newEffect);
            this.currentRoute.invalidateNextNodes(node);
            const currentNode = this.currentRoute.currentNode || this.currentRoute.getFirstNode();
            if (currentNode)
                this.setCurrentNode(currentNode.step.id);

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

            node.step.removeEffect(effect);
            this.currentRoute.invalidateNextNodes(node);
            const currentNode = this.currentRoute.currentNode || this.currentRoute.getFirstNode();
            if (currentNode)
                this.setCurrentNode(currentNode.step.id);

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