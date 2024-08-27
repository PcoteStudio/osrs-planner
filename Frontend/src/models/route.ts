import { PlayerState } from './playerState';
import { SkillEffect } from './skill/skillEffect';
import { SkillsEnum } from './skill/skillsEnum';
import { AbstractStepTreeNode, type BaseStepTreeNode, RootStepTreeNode, StepTreeNode } from './stepTreeNode';
import { Step } from './step';
import { JsonHelper } from '@/utils/jsonHelper';
import type { Effect } from './effect';
import { InvalidNodeMoveAfter } from '@/errors/invalidNodeMoveAfter';

export class Route {
  playerState: PlayerState = new PlayerState();
  rootNode: RootStepTreeNode = new RootStepTreeNode(-1);
  currentNode: StepTreeNode; // Current step is considered already executed

  constructor() {
    this.addStep(new Step('Initial step'));
    this.currentNode = this.getFirstNode();
  }

  addEffect(node: StepTreeNode, effect: Effect) {
    if (!node?.step) throw new Error('Cannot assign effect to undefined step');
    node.step.addEffect(effect);
    this.invalidateNextNodes(node);
    this.setCurrentNode(this.currentNode);
  }

  removeEffect(node: StepTreeNode, effect: Effect) {
    if (!node?.step) throw new Error('Cannot remove effect from undefined step');
    node.step.removeEffect(effect);
    this.invalidateNextNodes(node);
    this.setCurrentNode(this.currentNode);
  }

  addStep(newStep: Step, previousNode?: StepTreeNode): StepTreeNode {
    let newNode: StepTreeNode;
    if (previousNode) {
      newNode = new StepTreeNode(previousNode.parent.depth + 1, newStep, previousNode.parent);
      if (!previousNode.parent) throw new Error('previousNode doesn\'t have a parent');
      const previousNodeIndex = previousNode.parent.children.indexOf(previousNode);
      previousNode.parent.children.splice(previousNodeIndex + 1, 0, newNode);
      newNode.parent = previousNode.parent;
    } else {
      newNode = new StepTreeNode(0, newStep, this.rootNode);
      this.rootNode.children = [newNode, ...this.rootNode.children];
    }
    newNode.depth = newNode.parent.depth + 1;
    this.updateChildrenLabel(newNode.parent);
    this.invalidateNextNodes(newNode);
    return newNode;
  }

  addSubStep(newStep: Step, parentNode: BaseStepTreeNode): StepTreeNode {
    const newNode = new StepTreeNode(parentNode.depth + 1, newStep, parentNode);
    parentNode.children.splice(0, 0, newNode);
    this.updateChildrenLabel(newNode.parent);
    this.invalidateNextNodes(newNode);
    return newNode;
  }

  static canRemoveNode(node: StepTreeNode) {
    return Route.getPreviousNode(node) || Route.getNextNode(node);
  }

  removeNode(node: StepTreeNode) {
    if (!Route.canRemoveNode(node)) throw new Error('Cannot remove the only node');
    this.invalidateNextNodes(node);
    const nodeIndex = node.parent.children.indexOf(node);
    node.parent.children.splice(nodeIndex, 1);
    this.updateChildrenLabel(node.parent);
    // Make sure the current node is still in the tree
    let currentNode = this.currentNode;
    while (currentNode instanceof StepTreeNode) {
      if (currentNode === node) {
        if(node.parent.children.length) {
          this.setCurrentNode(node.parent.children[nodeIndex >= node.parent.children.length ? nodeIndex - 1 : nodeIndex]);
        } else {
          this.setCurrentNode(node.parent as StepTreeNode);
        }
      }
      if(currentNode.parent instanceof StepTreeNode)
        currentNode = currentNode.parent;
      else 
        return;
    }
  }

  static canMoveAfterNode(nodeToMove: StepTreeNode, previousNode: StepTreeNode): boolean {
    if(nodeToMove === previousNode) return false;
    let currentNode : StepTreeNode = previousNode;
    while (currentNode.parent) {
      if(currentNode.parent === nodeToMove) return false;
      if(currentNode.parent instanceof StepTreeNode)
        currentNode = currentNode.parent;
      else return true;
    }
    return true;
  }

  moveAfterNode(nodeToMove: StepTreeNode, previousNode: StepTreeNode): StepTreeNode {
    if (!Route.canMoveAfterNode(nodeToMove, previousNode))
      throw new InvalidNodeMoveAfter(nodeToMove, previousNode);
    this.invalidateNextNodes(nodeToMove);
    const previousParent = nodeToMove.parent;
    nodeToMove.parent.children = nodeToMove.parent.children.filter(node => node.step?.id !== nodeToMove.step?.id);
    nodeToMove.parent = previousNode?.parent;
    nodeToMove.parent.children.splice(nodeToMove.parent.children.indexOf(previousNode) + 1, 0, nodeToMove);
    this.updateChildrenDepth(nodeToMove);
    this.updateChildrenLabel(previousParent);
    this.updateChildrenLabel(nodeToMove.parent);
    this.invalidateNextNodes(nodeToMove);
    this.setCurrentNode(this.currentNode);
    return nodeToMove;
  }

  static canMoveToSubNode(nodeToMove: StepTreeNode, parentNode: BaseStepTreeNode): boolean {
    if(!(parentNode instanceof StepTreeNode)) // Previous node is root node
      return true;
    return Route.canMoveAfterNode(nodeToMove, parentNode);
  }

  moveToSubNode(nodeToMove: StepTreeNode, parentNode: BaseStepTreeNode): StepTreeNode {
    if (!Route.canMoveToSubNode(nodeToMove, parentNode))
      throw new Error('These nodes cannot be moved after one another');
    nodeToMove.parent.children = nodeToMove.parent.children.filter(node => node.step.id !== nodeToMove.step.id);
    nodeToMove.parent = parentNode;
    parentNode.children.splice(0, 0, nodeToMove);
    this.updateChildrenDepth(nodeToMove);
    this.updateChildrenLabel(this.rootNode);
    this.invalidateNextNodes(this.getFirstNode());
    this.setCurrentNode(this.currentNode);
    return nodeToMove;
  }

  updateChildrenDepth(parentNode: StepTreeNode) {
    parentNode.depth = (parentNode?.parent?.depth || 0) + 1;
    for (const childNode of parentNode.children)
      this.updateChildrenDepth(childNode);
  }

  updateChildrenParent(parentNode: StepTreeNode) {
    for (const childNode of parentNode.children) {
      childNode.parent = parentNode;
      this.updateChildrenParent(childNode);
    }
  }

  updateChildrenLabel(parentNode: BaseStepTreeNode) {
    let baseLabel: string;
    if (parentNode instanceof StepTreeNode) {
      baseLabel = `${parentNode.step.label}.`;
    } else {
      baseLabel = '';
    }
    for (let i = 0; i < parentNode.children.length; i++) {
      const childNode = parentNode.children[i];
      if (childNode.step)
        childNode.step.label = baseLabel + (i + 1);
      this.updateChildrenLabel(childNode);
    }
  }

  static getPreviousNode(node: StepTreeNode): StepTreeNode | undefined {
    if (node.children.length) // The node has a child
      return node.children[node.children.length - 1];
    while (node.parent) { // The node has a parent
      const nodeIndex = node.parent.children.indexOf(node);
      if (nodeIndex > 0) // The node has an immediate brother
        return node.parent.children[nodeIndex - 1];
      if (node.parent instanceof RootStepTreeNode)
        break;
      node = node.parent;
    }
    return undefined;
  }

  executeOnNextNodes(node: StepTreeNode, func: (node: StepTreeNode) => void) {
    func(node);
    const nextNode = Route.getNextNode(node);
    if (nextNode)
      this.executeOnNextNodes(nextNode, func);
  }

  static getNextNode(node: AbstractStepTreeNode): StepTreeNode | undefined {
    let currentNode = node;
    if (currentNode instanceof StepTreeNode) {
      const currentNodeIndex = currentNode.parent.children.indexOf(currentNode);
      if (currentNode.parent.children.length > currentNodeIndex + 1) {
        currentNode = currentNode.parent.children[currentNodeIndex + 1];
        while (currentNode.children.length) {
          currentNode = currentNode.children[0];
        }
      } else {
        if (currentNode.parent instanceof RootStepTreeNode)
          return undefined;
        currentNode = currentNode.parent;
      }
    } else {
      while (currentNode.children.length) {
        currentNode = currentNode.children[0];
      }
    }
    return (currentNode !== node) ? currentNode as StepTreeNode : undefined;
  }

  invalidateNextNodes(node: StepTreeNode | undefined) {
    if (!node)
      return;
    this.executeOnNextNodes(node, (node: StepTreeNode) => { node.step.resultingState = undefined; });
  }

  /**
     * Applies the next step.
     * @returns `true` if a another step was executed or `false` otherwise.
     */
  stepOnce(): boolean {
    if (this.currentNode?.step)
      this.currentNode.step.resultingState = this.playerState.clone();

    const nextNode = Route.getNextNode(this.currentNode ?? this.rootNode);
    if (!nextNode) return false;
    this.currentNode = nextNode;
    this.currentNode.step.applyEffects(this.playerState);
    return true;
  }

  completeNode(node: StepTreeNode) {
    node.step.completed = true;
    // if (node?.parent) { // Complete all previous brothers recursively
    //     const nodeIndex = node.parent.children.indexOf(node);
    //     if (nodeIndex > 0)
    //         this.completeNode(node.parent.children[nodeIndex - 1]);
    // }
    if (node?.children?.length) { // Complete all children recursively
      for (const childNode of node.children) {
        this.completeNode(childNode);
      }
    }
  }

  uncompleteNode(node: StepTreeNode) {
    node.step.completed = false;

    let parentNode = node.parent;
    while (parentNode instanceof StepTreeNode && parentNode.step.completed) { // Uncomplete the direct parent and grand-parents
      parentNode.step.completed = false;
      parentNode = node.parent;
    }
    if (node.children.length) { // Uncomplete all children recursively
      for (const childNode of node.children)
        this.uncompleteNode(childNode);
    }
  }

  toggleNodeCompletion(node: StepTreeNode) {
    if (node.step.completed === true)
      this.uncompleteNode(node);
    else if (node.step.completed === false)
      this.completeNode(node);
  }

  /**
     * Applies the next steps until the specified step is applied or until the last step.
     * @param step Once this step is executed, will return.
     */
  setCurrentNode(node: StepTreeNode) {
    if (node.step.resultingState) { // Load pre-processed step
      if (this.currentNode?.step)
        this.currentNode.step.resultingState = this.playerState.clone();
      this.playerState = node.step.resultingState;
      this.currentNode = node;
      return;
    }

    if (!this.getCurrentStep()?.resultingState) { // Re-process all steps
      this.playerState = new PlayerState();
      this.currentNode = this.getFirstNode();
      this.currentNode.step.applyEffects(this.playerState);
    }

    let wasStepExecuted = true;
    while (node?.step.id !== this.getCurrentStep()?.id && wasStepExecuted) {
      wasStepExecuted = this.stepOnce();
    }
  }

  getStepCount(fromNode: BaseStepTreeNode, filter?: (node: StepTreeNode) => boolean): number {
    let total = 0;
    for (const node of fromNode.children) {
      total += ((filter?.(node) ?? true) ? 1 : 0) + this.getStepCount(node, filter);
    }
    return total;
  }

  getFirstNode(): StepTreeNode {
    return Route.getNextNode(this.rootNode) as StepTreeNode;
  }

  getLastNode(): StepTreeNode {
    return this.rootNode.children[this.rootNode.children.length - 1];
  }

  getFirstStep(): Step {
    return this.getFirstNode().step;
  }

  getCurrentStep(): Step {
    return this.currentNode.step;
  }

  getLastStep(): Step {
    return this.getLastNode().step;
  }

  getPlayerState(): PlayerState {
    return this.playerState;
  }

  toString(): string {
    return Route.toString(this.rootNode);
  }

  static toString(node: BaseStepTreeNode): string {
    let result: string = '';
    if (node instanceof StepTreeNode) {
      result += `${node.step.label} ${node.step.description}`
                + `, depth:${node.depth}`
                + `${node.step.effects.length ? `, ${node.step.effects.length} effects` : ''}`
                + `${node.step.completed ? ', completed' : ''}`
                + `${node.step.resultingState ? ', generated' : ''}`;
    } else {
      result += 'root';
    }
    for (const childNode of node.children) {
      const isLastChild = node.children[node.children.length - 1] === childNode;
      result += `\n  ${'│  '.repeat(childNode.depth > 0 ? 1 : 0)}`
                + `${'│  '.repeat(childNode.depth * 0.5)}`
                + `${' '.repeat(childNode.depth * 0.5)}`
                + `${isLastChild ? '└' : '├'}─ ${this.toString(childNode)}`;
    }
    return result;
  }

  toJSON() {
    return { rootNode: this.rootNode.toJSON() };
  }

  static fromJSON(jsonObject: { [key: string]: any }): Route {
    JsonHelper.parseWithSchema<Route>('Route', jsonObject);
    const route: Route = new Route();
    route.rootNode = RootStepTreeNode.fromJSON(jsonObject.rootNode);
    route.updateChildrenLabel(route.rootNode);
    route.setCurrentNode(route.getFirstNode());
    return route;
  }

  static findNodeById(node: BaseStepTreeNode, id: string): StepTreeNode | undefined {
    if (node instanceof StepTreeNode && node.step?.id === id )
      return node;
    for (const childNode of node.children) {
      const foundNode = Route.findNodeById(childNode, id);
      if(foundNode) return foundNode;
    }
    return undefined;
  };

  initializeSomeSteps() {
    let step = new Step('Vu la restriction que nous constatons, je n\'exclus pas de caractériser systématiquement les décisions évidentes, parce que la nature a horreur du vide. Si vous voulez mon avis concernant cette rigueur contextuelle, nous sommes contraints de prendre en considération la plus grande partie des synergies déclinables, pour longtemps.');
    step.addEffect(new SkillEffect(SkillsEnum.Agility, 100));
    step.addEffect(new SkillEffect(SkillsEnum.Attack, 100));
    step.addEffect(new SkillEffect(SkillsEnum.Construction, 100));
    step.addEffect(new SkillEffect(SkillsEnum.Cooking, 100));
    step.addEffect(new SkillEffect(SkillsEnum.Crafting, 100));
    step.addEffect(new SkillEffect(SkillsEnum.Defence, 100));
    step.addEffect(new SkillEffect(SkillsEnum.Farming, 100));
    step.addEffect(new SkillEffect(SkillsEnum.Firemaking, 100));
    step.addEffect(new SkillEffect(SkillsEnum.Fishing, 100));
    step.addEffect(new SkillEffect(SkillsEnum.Fletching, 100));
    step.addEffect(new SkillEffect(SkillsEnum.Herblore, 100));
    step.addEffect(new SkillEffect(SkillsEnum.Hitpoints, 100));
    step.addEffect(new SkillEffect(SkillsEnum.Hunter, 100));
    step.addEffect(new SkillEffect(SkillsEnum.Magic, 100));
    step.addEffect(new SkillEffect(SkillsEnum.Mining, 100));
    step.addEffect(new SkillEffect(SkillsEnum.Prayer, 100));
    step.addEffect(new SkillEffect(SkillsEnum.Ranged, 100));
    step.addEffect(new SkillEffect(SkillsEnum.Runecraft, 100));
    step.addEffect(new SkillEffect(SkillsEnum.Slayer, 100));
    step.addEffect(new SkillEffect(SkillsEnum.Smithing, 100));
    step.addEffect(new SkillEffect(SkillsEnum.Strength, 100));
    step.addEffect(new SkillEffect(SkillsEnum.Thieving, 100));
    step.addEffect(new SkillEffect(SkillsEnum.Woodcutting, 100));
    step.completed = true;
    const node1 = this.addStep(step);

    step = new Step('I am another top step');
    step.addEffect(new SkillEffect(SkillsEnum.Herblore, 300));
    const node2 = this.addStep(step, node1);

    step = new Step('En ce qui concerne la restriction actuelle, on ne peut se passer d\'imaginer chacune des modalités opportunes, à court terme.');
    step.addEffect(new SkillEffect(SkillsEnum.Attack, 2000));
    const node21 = this.addSubStep(step, node2);

    step = new Step('I am another child step');
    step.addEffect(new SkillEffect(SkillsEnum.Defence, 1500));
    const node22 = this.addStep(step, node21);

    step = new Step('I am a grand-child step');
    step.addEffect(new SkillEffect(SkillsEnum.Fishing, 30000));
    const node221 = this.addSubStep(step, node22);

    step = new Step('I am a grand-child step');
    step.addEffect(new SkillEffect(SkillsEnum.Fishing, 30000));
    const node222 = this.addStep(step, node221);

    step = new Step('I am a grand-child step');
    step.addEffect(new SkillEffect(SkillsEnum.Fishing, 30000));
    this.addStep(step, node222);

    step = new Step('I am a just a child step');
    step.addEffect(new SkillEffect(SkillsEnum.Mining, 2000));
    this.addStep(step, node22);

    step = new Step('I am a but a meager top step');
    step.addEffect(new SkillEffect(SkillsEnum.Farming, 50000));
    const node3 = this.addStep(step, node2);

    step = new Step('I am the last top step');
    step.addEffect(new SkillEffect(SkillsEnum.Smithing, 500));
    const node4 = this.addStep(step, node3);

    step = new Step('I am the last top step');
    step.addEffect(new SkillEffect(SkillsEnum.Smithing, 500));
    const node5 = this.addStep(step, node4);

    step = new Step('I am the last top step');
    step.addEffect(new SkillEffect(SkillsEnum.Smithing, 500));
    const node6 = this.addStep(step, node5);

    step = new Step('I am the last top step');
    step.addEffect(new SkillEffect(SkillsEnum.Smithing, 500));
    const node7 = this.addStep(step, node6);

    step = new Step('I am the last top step');
    step.addEffect(new SkillEffect(SkillsEnum.Smithing, 500));
    this.addStep(step, node7);

    this.stepOnce();
  }
}
