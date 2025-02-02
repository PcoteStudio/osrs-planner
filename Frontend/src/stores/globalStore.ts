import { defineStore } from 'pinia';
import { RootStepNode, StepNode } from '@/models/stepTreeNode';
import { Route } from '@/models/route';
import { PlayerState } from '@/models/playerState';
import { SkillsEnum } from '@/models/skill/skillsEnum';
import { Effect, EffectTypeEnum } from '@/models/effect';
import { type Notification } from '@/components/Notification/notificationTypes';
import { SkillEffect } from '@/models/skill/skillEffect';
import { Step } from '@/models/step';
import { loremIpsum } from 'lorem-ipsum';
import { ShowEffectTypes } from '@/types/showEffectTypes';
import { Item } from '@/models/item/item';
import { type EffectType } from '@/types/itemEffectTypes';

export const useGlobalStore = defineStore('globalStore', {
  state: () => {
    const playerState: PlayerState = new PlayerState();
    const currentRoute: Route = new Route();
    currentRoute.playerState = playerState;

    const effectState = {
      showEffects: ShowEffectTypes.showCurrent,
      showModal: true,
      effect: {
        category: EffectTypeEnum.Item,
        data: {
          stepId: 'wololo'
        }
      } as EffectType | undefined,
      // effect: undefined as EffectType | undefined,
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
    getNodeList: (state): StepNode[] => {
      return state.currentRoute.rootNode.toArray();
    },
    getNodeTree: (state): StepNode[] => {
      return state.currentRoute.rootNode.children as StepNode[];
    },
    getNodeById: (state) => {
      return (nodeId?: string): StepNode | undefined => {
        if (!nodeId)
          return undefined;
        return state.currentRoute.rootNode.findNodeById(nodeId);
      };
    },
    getCurrentSkillExp: (state) => {
      return (skill: SkillsEnum): number => state.currentRoute.getPlayerState().skills.getSkillExperience(skill);
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

        return node.toArray().length;
      };
    },
    getInventory: (state) => {
      return state.currentRoute.getPlayerState().inventory;
    },
    getEquipment: (state) => {
      return state.currentRoute.getPlayerState().equipment;
    }
  },
  actions: {
    setCurrentNode(nodeId: string) {
      const node = this.currentRoute.rootNode.findRequiredNodeById(nodeId);
      this.currentRoute.setCurrentNode(node);
    },
    setCurrentRoute(newRoute: Route) {
      this.currentRoute = newRoute;
      this.currentRoute.setCurrentNode(this.currentRoute.getFirstNode());

      const nbSteps = newRoute.getStepCount(this.currentRoute.rootNode as RootStepNode);

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
    addEffect(effectType: EffectType, newEffect: Effect) {
      const node = this.currentRoute.rootNode.findRequiredNodeById(effectType.data.stepId);

      const effect = this.getEffectState.effect;
      if (effect?.category === EffectTypeEnum.Skill) {
        effect.data.skill = undefined;
      }
      else if (effect?.category === EffectTypeEnum.Item) {
        effect.data.action = undefined;
        effect.data.item = undefined;
      }

      this.currentRoute.addEffect(node, newEffect);

      this.addNotification({
        action: 'addEffect',
        data: {
          effect: newEffect,
          stepLabel: node.step.label
        }
      });
    },
    removeEffect(effectType: EffectType, effect: Effect) {
      const node = this.currentRoute.rootNode.findRequiredNodeById(effectType.data.stepId);

      this.currentRoute.removeEffect(node, effect);

      this.addNotification({
        action: 'removeEffect',
        data: {
          effect: effect,
          stepLabel: node.step.label
        }
      });
    },
    //openEffectModal(nodeId?: string, arg?: Effect | Skill | Item) {
    openEffectModal(effectType?: EffectType) {
      if (effectType) {
        this.effectState.effect = effectType;
      }
      else {
        this.effectState.effect = undefined;
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
        this.getCurrentRoute.moveNode(nodeToMove, previousNode);
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
      return Route.canMoveNode(nodeToMove, previousNode);
    },
    toggleEffects() {
      if (this.effectState.showEffects === ShowEffectTypes.showCurrent)
        this.effectState.showEffects = ShowEffectTypes.showAll;
      else if (this.effectState.showEffects === ShowEffectTypes.showAll)
        this.effectState.showEffects = ShowEffectTypes.showNone;
      else if (this.effectState.showEffects === ShowEffectTypes.showNone)
        this.effectState.showEffects = ShowEffectTypes.showCurrent;
    },
    noteItem(item: Item, quantity: number) {
      if (item.noted)
        this.getCurrentRoute.getPlayerState().inventory.unnoteItems(item, quantity);
      else
        this.getCurrentRoute.getPlayerState().inventory.noteItems(item, quantity);
    },
  },
});