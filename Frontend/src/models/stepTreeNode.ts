import { JsonHelper } from '@/utils/jsonHelper';
import { Step } from './step';
import { LabeledStep } from './step';

export type BaseStepNode = StepNode | RootStepNode;

export abstract class AbstractStepNode {
  children: StepNode[] = [];

  toJSON(): object {
    return { children: this.children.map(c => c.toJSON()) };
  }

  toArray() {
    const list: LabeledStep[] = [];
    for (const [index, child] of this.children.entries()) {
      this.toArrayRecursive(child, list, [index + 1]);
    }
    return list;
  };

  private toArrayRecursive(node: StepNode, list: LabeledStep[], path: number[]) {
    list.push(new LabeledStep(node.step, path));
    for (const [index, child] of this.children.entries()) {
      this.toArrayRecursive(child, list, [...path, index + 1]);
    }
  };
  
  addChildAt(node: StepNode, i: number) {
    this.children.splice(i, 0, node);
  }

  removeChildAt(i: number): StepNode {
    return this.children.splice(i, 1)[0];
  }

  public findRequiredNodeById(id: string): StepNode {
    const node = this.findNodeById(id);
    if (!node)
      throw new Error(`Step node with id ${id} was not found`);
    return node;
  };

  public abstract findNodeById(id: string): StepNode | undefined;
}

export class RootStepNode extends AbstractStepNode {

  static fromJSON(jsonObject: Record<string, any>): RootStepNode {
    const parsedNode = JsonHelper.parseWithSchema<RootStepNode>('RootStepNode', jsonObject);
    const rootNode = new RootStepNode();
    for (const child of parsedNode.children) {
      const childNode = StepNode.fromJSON(child);
      rootNode.children.push(childNode);
    }
    return rootNode;
  }

  public findNodeById(id: string): StepNode | undefined {
    for (const child of this.children) {
      const node = child.findNodeById(id);
      if (node)
        return node;
    }
  }
}

export class StepNode extends AbstractStepNode {

  constructor(public step: Step) {
    super();
  };

  public findNodeById(id: string): StepNode | undefined {
    if (this.step.id === id)
      return this;

    for (const child of this.children) {
      const node = child.findNodeById(id);
      if (node)
        return node;
    }
  }

  toJSON(): object {
    return { ...super.toJSON(), step: this.step.toJSON() };
  }

  static fromJSON(jsonObject: Record<string, any>): StepNode {
    const parsedNode = JsonHelper.parseWithSchema<StepNode>('StepNode', jsonObject);
    const node = new StepNode(Step.fromJSON(parsedNode.step));
    for (const child of parsedNode.children) {
      const childNode = StepNode.fromJSON(child);
      node.children.push(childNode);
    }
    return node;
  }
}