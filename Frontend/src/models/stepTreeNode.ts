import { JsonHelper } from '@/utils/jsonHelper';
import { Step } from './step';


export type BaseStepTreeNode = StepTreeNode | RootStepTreeNode;

export abstract class AbstractStepTreeNode {
    depth: number;
    children: StepTreeNode[] = [];

    constructor(depth: number) {
        this.depth = depth;
    }

    toJSON(): object {
        return { depth: this.depth, children: this.children.map(c => c.toJSON()) };
    }

    public toFlatList() {
        const list: StepTreeNode[] = [];
        for (const child of this.children) {
            this.toFlatListRec(child, list);
        }
        return list;
    };

    private toFlatListRec(node: StepTreeNode, list: StepTreeNode[]) {
        list.push(node);
        for (const child of node.children) {
            this.toFlatListRec(child, list);
        }
    };

    public findRequiredNodeById(id: string): StepTreeNode {
        const node = this.findNodeById(id);
        if (!node)
            throw new Error(`Step node with id ${id} was not found`);
        return node;
    };

    public abstract findNodeById(id: string): StepTreeNode | undefined;
}


export class RootStepTreeNode extends AbstractStepTreeNode {

    static fromJSON(jsonObject: Record<string, any>): RootStepTreeNode {
        const parsedNode = JsonHelper.parseWithSchema<RootStepTreeNode>('RootStepTreeNode', jsonObject);
        const rootNode = new RootStepTreeNode(parsedNode.depth);
        for (const child of parsedNode.children) {
            const childNode = StepTreeNode.fromJSON(child, rootNode);
            rootNode.children.push(childNode);
        }
        return rootNode;
    }

    public findNodeById(id: string): StepTreeNode | undefined {
        for (const child of this.children) {
            const node = child.findNodeById(id);
            if (node)
                return node;
        }
    }
}

export class StepTreeNode extends AbstractStepTreeNode {
    constructor(
        depth: number,
        public step: Step,
        public parent: BaseStepTreeNode
    ) {
        super(depth);
    };

    public findNodeById(id: string): StepTreeNode | undefined {
        if (this.step.id === id)
            return this;

        for (const child of this.children) {
            const node = child.findNodeById(id);
            if (node)
                return node;
        }
    }

    /**
     * @override
     */
    toJSON(): object {
        return { ...super.toJSON(), step: this.step.toJSON() };
    }

    static fromJSON(jsonObject: Record<string, any>, parent: BaseStepTreeNode): StepTreeNode {
        const parsedNode = JsonHelper.parseWithSchema<StepTreeNode>('StepTreeNode', jsonObject);
        const node = new StepTreeNode(parsedNode.depth, Step.fromJSON(parsedNode.step), parent);
        for (const child of parsedNode.children) {
            const childNode = StepTreeNode.fromJSON(child, node);
            node.children.push(childNode);
        }
        return node;
    }
}