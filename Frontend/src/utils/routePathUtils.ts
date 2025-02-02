import { StepNode, type BaseStepNode } from '@/models/stepTreeNode';

export type RoutePathTest = (testedPath: number[], refPath: number[]) => boolean;

interface VisitNodeContext {
  test: RoutePathTest;
  initialPath: number[];
  foundNodes: StepNode[];
}

function visitNode(context: VisitNodeContext, node: BaseStepNode, path: number[]): void {
  for (let i = 0; i < node.children.length; i++) {
    visitNode(context, node.children[i], [...path, i + 1]);
  }
  if (node instanceof StepNode && context.test(path, context.initialPath)) {
    context.foundNodes.push(node);
  }
}

export function getSpecificNodes(rootNode: BaseStepNode, initialPath: number[], test: RoutePathTest): StepNode[] {
  const foundNodes: StepNode[] = [];
  visitNode({ test, foundNodes, initialPath }, rootNode, []);
  return foundNodes;
}

export function isAfter(testedPath: number[], refPath: number[]): boolean {
  for (let i = 0; i < testedPath.length; i++) {
    if (testedPath[i] < refPath[i]) {
      return false;
    }
    if (testedPath[i] > refPath[i]) {
      return true;
    }
  }
  if(testedPath.length < refPath.length){
    return true;
  }
  return false;
}

export function isUnder(testedPath: number[], refPath: number[]): boolean {
  if(testedPath.length === refPath.length)
    return false;
  for (let i = 0; i < refPath.length; i++)
    if (testedPath[i] !== refPath[i])
      return false;
  return true;
}

export function isAncestorOf(testedPath: number[], refPath: number[]): boolean {
  if(testedPath.length === refPath.length)
    return false;
  for (let i = 0; i < testedPath.length; i++)
    if (testedPath[i] !== refPath[i])
      return false;
  return true;
}