import { PlayerState } from './playerState';
import { type BaseStepNode, RootStepNode, StepNode } from './stepTreeNode';
import { Step } from './step';
import { JsonHelper } from '@/utils/jsonHelper';
import type { Effect } from './effect';
import { InvalidNodeMove } from '@/errors/invalidNodeMoveAfter';
import { getSpecificNodes, isAfter, isAncestorOf, isUnder } from '../utils/routePathUtils';

export class Route {
  playerState: PlayerState = new PlayerState();
  rootNode: RootStepNode = new RootStepNode();
  currentNode: StepNode; // Current step is considered already executed

  constructor() {
    const firstNode = this.addStep(new Step('Initial step'), [1]);
    this.currentNode = firstNode;
  }

  getStepNode(path: number[]): StepNode {
    const node = this.getNode(path);
    if(node instanceof RootStepNode)
      throw new Error('This operation cannot be performed on the root node');
    return node as StepNode;
  }

  getNode(path: number[]): BaseStepNode {
    let currentPath = path;
    let currentNode: BaseStepNode = this.rootNode;
    while (currentPath.length) {
      const index = currentPath[0] - 1;
      currentPath = currentPath.slice(1);
      currentNode = currentNode.children[index];
    }
    return currentNode;
  }

  invalidateFollowingNodes(path: number[]) {
    const nextNodes = getSpecificNodes(this.rootNode, path, isAfter);
    for (const node of nextNodes)
      node.step.invalidate();
  }

  completeNode(path: number[]) {
    const node = this.getStepNode(path);
    node.step.completed = true;
    
    const childNodes = getSpecificNodes(this.rootNode, path, isUnder);
    for (const childNode of childNodes)
      childNode.step.completed = true;
  }

  uncompleteNode(path: number[]) {
    const node = this.getStepNode(path);
    node.step.completed = false;

    const parentNodes = getSpecificNodes(this.rootNode, path, isAncestorOf);
    for (const parentNode of parentNodes)
      parentNode.step.completed = false;
  }

  addEffect(path: number[], effect: Effect) {
    const node = this.getStepNode(path);
    node.step.addEffect(effect); 
    this.invalidateFollowingNodes(path);
    this.setCurrentNode(this.currentNode);
  }

  removeEffect(path: number[], effect: Effect) {
    const node = this.getStepNode(path);
    node.step.removeEffect(effect);
    this.invalidateFollowingNodes(path);
    this.setCurrentNode(this.currentNode);
  }

  addStep(newStep: Step, path: number[]): StepNode {
    if (path.length === 0) throw new Error('The path cannot be empty');

    const parentPath = path.slice(0, -1);
    const parentNode = this.getNode(parentPath);
    const index = path.slice(-1)[0] - 1;
    if (parentNode.children.length > index || index < 0) throw new Error(`Cannot add a step with an invalid path: ${path.join('.')}`);
    
    const newNode = new StepNode(newStep);
    parentNode.addChildAt(newNode, index);
    this.invalidateFollowingNodes(path);
    return newNode;
  }

  /**
   * Check if a node can be removed.
   * A node cannot be removed if it's the last child of the root node.
   * @param node Node to check.
   * @returns `true` if the node can be removed, `false` otherwise.
   */
  private canRemoveNode(path: number[]): boolean {
    return (path.length > 1 || this.rootNode.children.length > 1);
  }

  removeNode(path: number[]) {
    if (!this.canRemoveNode(path)) throw new Error('Cannot remove the only node');

    const parentPath = path.slice(0, -1);
    const parentNode = this.getNode(parentPath);
    const removedNode = this.getNode(path);
    const index = path.slice(-1)[0] - 1;
    this.invalidateFollowingNodes(path);
    parentNode.removeChildAt(index);

    const currentNode = this.currentNode;
    while (currentNode instanceof StepNode) {
      if (currentNode === removedNode) {
        if (index > 0 && parentNode.children.length) {
          // Current node becomes a lower index sibling of the removed node
          this.setCurrentNode(parentNode.children[index >= parentNode.children.length ? index - 1 : index]);
        } else {
          // Current node becomes the parent of the removed node
          this.setCurrentNode(parentNode as StepNode);
        }
        return;
      } else {
        // TODO Make sure the current node is still in the tree
        this.setCurrentNode(this.getFirstNode());
      }
    }
  }

  /**
   * Check if a node can moved from one branch to another.
   * A node cannot be moved to a lower node on the same branch to avoid cyclic relationships.
   * @param initialPath Path of the node to move.
   * @param finalPath Expected path of the node after the move.
   * @returns `true` if the node can be moved, `false` otherwise.
   */
  static canMoveNode(initialPath: number[], finalPath: number[]): boolean {
    if (initialPath.length === 0 || finalPath.length === 0) 
      return false;
    for (const [index, value] of finalPath.entries()) {
      if (index >= initialPath.length || value !== initialPath[index])
        return true;
    }
    return false;
  }

  moveNode(initialPath: number[], finalPath: number[]): StepNode {
    if (!Route.canMoveNode(initialPath, finalPath))
      throw new InvalidNodeMove(initialPath, finalPath);

    const nodeToMove = this.getNode(initialPath) as StepNode;
    const finalNode = this.addStep(nodeToMove.step, finalPath);
    finalNode.children = nodeToMove.children;
    this.invalidateFollowingNodes(finalPath);
    this.removeNode(initialPath);

    if (this.currentNode === nodeToMove)
      this.setCurrentNode(finalNode);
    else
      this.setCurrentNode(this.currentNode);
    return finalNode;
  }

  private stepUntil(toNode: StepNode): StepNode {
    this.playerState = new PlayerState();
    const foundNode = this.stepInChildrenUntil(this.rootNode, toNode);
    if(!foundNode) throw new Error('The node was unreachable');
    return foundNode;
  }

  private stepInChildrenUntil(parentNode: BaseStepNode, toNode: StepNode): StepNode | undefined {
    for (const child of parentNode.children) {
      const foundNode = this.stepInChildrenUntil(child, toNode);
      if(foundNode) return foundNode;

      this.stepInNode(child);
      if(child === toNode) return child;
    }
    return undefined;
  }

  private stepInNode(node:StepNode) {
    // Save previous node resulting state
    if(!this.currentNode.step.upToDate || !this.currentNode.step.resultingState) {
      this.currentNode.step.resultingState = this.playerState.clone();
    }

    // Apply effects of new node
    this.currentNode = node;
    if(node.step.upToDate && node.step.resultingState) {
      this.playerState = node.step.resultingState;
    } else {
      node.step.applyEffects(this.playerState);
    }
  }

  /**
   * Applies the next steps until the specified step is applied or until the last step.
   * @param step Once this step is executed, will return.
   */
  setCurrentNode(node: StepNode) {
    // Save state of current node
    this.currentNode.step.resultingState = this.playerState.clone();
      
    // Load valid saved state if exists
    if (node.step.upToDate && node.step.resultingState) {
      this.playerState = node.step.resultingState;
      this.currentNode = node;
      return;
    }

    // Re-process all steps from the root
    this.stepUntil(node);
  }

  getStepCount(fromNode: BaseStepNode, filter?: (node: StepNode) => boolean): number {
    let total = 0;
    for (const node of fromNode.children) {
      total += ((filter?.(node) ?? true) ? 1 : 0) + this.getStepCount(node, filter);
    }
    return total;
  }

  getFirstNode(): StepNode {
    let node = this.rootNode.children[0];
    while (node.children.length > 0) {
      node = node.children[0];
    }
    return node;
  }

  getLastNode(): StepNode {
    return this.rootNode.children[this.rootNode.children.length - 1];
  }

  toJSON() {
    return { rootNode: this.rootNode.toJSON() };
  }

  static fromJSON(jsonObject: { [key: string]: any }): Route {
    JsonHelper.parseWithSchema<Route>('Route', jsonObject);
    const route: Route = new Route();
    route.rootNode = RootStepNode.fromJSON(jsonObject.rootNode);
    route.setCurrentNode(route.getFirstNode());
    return route;
  }

  static findNodeById(node: BaseStepNode, id: string): StepNode | undefined {
    if (node instanceof StepNode && node.step?.id === id )
      return node;
    for (const childNode of node.children) {
      const foundNode = Route.findNodeById(childNode, id);
      if(foundNode) return foundNode;
    }
    return undefined;
  };
}
