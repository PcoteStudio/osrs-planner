import type { Step } from './step';

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

    toJSON(): string {
        return JSON.stringify({ step: this.step, depth: this.depth, children: this.children });
    }
}