import { defineStore } from 'pinia';
import { RootStepTreeNode, StepTreeNode } from '@/models/stepTreeNode';
import { Route } from '@/models/route';
import { PlayerState } from '@/models/playerState';
import { SkillsEnum } from '@/models/skill/skillsEnum';
import { Effect, EffectTypeEnum } from '@/models/effect';
import { type Notification } from '@/components/Notification/notificationTypes';
import { SkillEffect } from '@/models/skill/skillEffect';
import { Step } from '@/models/step';
import { loremIpsum } from 'lorem-ipsum';
import { Skill } from '@/models/skill/skill';
import { ShowEffectTypes } from '@/types/showEffectTypes';

export const useGlobalStore = defineStore('globalStore', {
  state: () => {
    const playerState: PlayerState = new PlayerState();
    const currentRoute: Route = new Route();
    currentRoute.playerState = playerState;

    const effectState = {
      showEffects: ShowEffectTypes.showCurrent,
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
      isEditing: false,
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
    getNodeList: (state): StepTreeNode[] => {
      return state.currentRoute.rootNode.toFlatList();
    },
    getNodeTree: (state): StepTreeNode[] => {
      return state.currentRoute.rootNode.children as StepTreeNode[];
    },
    getNodeById: (state) => {
      return (nodeId?: string): StepTreeNode | undefined => {
        if (!nodeId)
          return undefined;
        return state.currentRoute.rootNode.findNodeById(nodeId);
      };
    },
    getCurrentSkillExp: (state) => {
      return (skill: SkillsEnum): number => state.currentRoute.getPlayerState().getSkillExperience(skill);
    },
    findEffect: (state) => {
      return (nodeId: string, effectType: EffectTypeEnum, skillType?: SkillsEnum): Effect | undefined => {
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
    getStepState: (state) => {
      return state.stepState;
    },
    getChildrenCount: (state) => {
      return (nodeId: string): number => {
        const node = state.currentRoute.rootNode.findRequiredNodeById(nodeId);

        return node.toFlatList().length;
      };
    },
    getInventory: (state) => {
      return state.currentRoute.getPlayerState().inventory;
    },
  },
  actions: {
    setCurrentNode(nodeId: string) {
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
      let result = true;
      if (this.currentRoute.getCurrentStep() === node.step) {
        while (result && this.currentRoute.getCurrentStep()?.completed) {
          result = this.currentRoute.stepOnce();
        }
      }

      this.addNotification({
        action: 'toggleCompleted',
        data: {
          stepLabel: node.step.label,
          completed: node.step.completed,
        }
      });
      setTimeout(() => {
        document.getElementById('current')?.scrollIntoView({ behavior: 'smooth' });
      }, 10);
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
      this.getEffectState.skill = undefined;

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
    openEffectModal(nodeId?: string, arg?: Effect | Skill) {
      if (nodeId)
        this.effectState.node = this.currentRoute.rootNode.findRequiredNodeById(nodeId);
      else
        this.effectState.node = this.currentRoute.currentNode;

      this.effectState.type = undefined;
      this.effectState.skill = undefined;

      if (arg instanceof Effect) {
        this.effectState.type = arg.type;
      }
            
      if (arg instanceof SkillEffect) {
        this.effectState.skill = arg.skill;
      }

      if (arg instanceof Skill) {
        this.effectState.type = EffectTypeEnum.Skill;
        this.effectState.skill = arg.type;
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
      const newRoute = Route.fromJSON(JSON.parse(data));
      this.setCurrentRoute(newRoute);
    },
    toggleIsEditingSteps() {
      this.stepState.isEditing = !this.stepState.isEditing;
    },
    addStep(nodeId: string) {
      const node = this.currentRoute.rootNode.findRequiredNodeById(nodeId);
      const newStep = new Step(loremIpsum());
      this.getCurrentRoute.addStep(newStep, node);
    },
    addSubStep(nodeId: string) {
      const node = this.currentRoute.rootNode.findRequiredNodeById(nodeId);
      const newStep = new Step(loremIpsum());
      this.getCurrentRoute.addSubStep(newStep, node);
    },
    removeStep(nodeId: string) {
      const node = this.currentRoute.rootNode.findRequiredNodeById(nodeId);
      this.currentRoute.removeNode(node);
    },
    moveNode(nodeIdToMove: string, previousNodeId: string, child?: boolean) {
      if (!nodeIdToMove || !previousNodeId || child === undefined)
        return false;

      const nodeToMove = this.currentRoute.rootNode.findRequiredNodeById(nodeIdToMove);
      const previousNode = this.currentRoute.rootNode.findRequiredNodeById(previousNodeId);

      if (child) {
        this.getCurrentRoute.moveToSubNode(nodeToMove, previousNode);
      }
      else {
        this.getCurrentRoute.moveAfterNode(nodeToMove, previousNode);
      }
    },
    canMoveAfterNode(nodeIdToMove?: string, previousNodeId?: string, child?: boolean) {
      if (!nodeIdToMove || !previousNodeId || child === undefined)
        return false;

      const nodeToMove = this.currentRoute.rootNode.findRequiredNodeById(nodeIdToMove);
      const previousNode = this.currentRoute.rootNode.findRequiredNodeById(previousNodeId);

      if (child) {
        return Route.canMoveToSubNode(nodeToMove, previousNode);
      }
      return Route.canMoveAfterNode(nodeToMove, previousNode);
    },
    toggleEffects() {
      if (this.effectState.showEffects === ShowEffectTypes.showCurrent)
        this.effectState.showEffects = ShowEffectTypes.showAll;
      else if (this.effectState.showEffects === ShowEffectTypes.showAll)
        this.effectState.showEffects = ShowEffectTypes.showNone;
      else if (this.effectState.showEffects === ShowEffectTypes.showNone)
        this.effectState.showEffects = ShowEffectTypes.showCurrent;
    }
  },
});