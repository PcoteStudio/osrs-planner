import { validatePropertyIterability, validatePropertyType } from '@/utils/parsingValidators';
import { Step } from './step';

export class StepTreeNode {
    step: Step | undefined;
    depth: number;
    parent?: StepTreeNode | undefined;
    children: StepTreeNode[] = [];

    constructor(depth: number, step?: Step | undefined, parent?: StepTreeNode | undefined) {
        this.depth = depth;
        this.step = step;
        this.parent = parent;
    }

    toJSON() {
        return { step: this.step, depth: this.depth, children: this.children };
    }

    static fromJSON(jsonObject: { [key: string]: any }): StepTreeNode {
        validatePropertyType(StepTreeNode, jsonObject, 'depth', 'number');
        validatePropertyIterability(StepTreeNode, jsonObject, 'children');
        const node = new StepTreeNode(jsonObject.depth);
        if (jsonObject.step) node.step = Step.fromJSON(jsonObject.step);
        for (const child of jsonObject.children) {
            const childNode = StepTreeNode.fromJSON(child);
            childNode.parent = node;
            node.children.push(childNode);
        }
        return node;
    }
}