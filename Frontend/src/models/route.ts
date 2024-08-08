import { PlayerState } from './playerState';
import { SkillEffect } from './skill/skillEffect';
import { SkillsEnum } from './skill/skillsEnum';
import { StepTreeNode } from './stepTreeNode';
import { Step } from './step';
import { validatePropertyType } from '@/utils/parsingValidators';

export class Route {
    playerState: PlayerState = new PlayerState();
    rootNode: StepTreeNode = new StepTreeNode(-1);
    currentNode: StepTreeNode | undefined; // Current step is considered already executed

    initializeSomeSteps() {
        let step = new Step('Vu la restriction que nous constatons, je n\'exclus pas de caractériser systématiquement les décisions évidentes, parce que la nature a horreur du vide.');
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

    addStep(newStep: Step, previousNode?: StepTreeNode): StepTreeNode {
        const newNode: StepTreeNode = new StepTreeNode(previousNode?.parent ? previousNode?.parent?.depth + 1 : 0, newStep);
        if (previousNode) {
            if (!previousNode.parent) throw new Error('previousNode doesn\'t have a parent');
            const previousNodeIndex = previousNode.parent.children.indexOf(previousNode);
            previousNode.parent.children.splice(previousNodeIndex + 1, 0, newNode);
            newNode.parent = previousNode.parent;
        } else {
            this.rootNode.children.push(newNode);
            newNode.parent = this.rootNode;
        }
        newNode.depth = newNode.parent.depth + 1;
        this.updateChildrenLabel(newNode.parent);
        this.invalidateNextNodes(newNode);
        return newNode;
    }

    addSubStep(newStep: Step, parentNode: StepTreeNode): StepTreeNode {
        const newNode = new StepTreeNode(parentNode.depth + 1, newStep, parentNode);
        parentNode.children.splice(0, 0, newNode);
        this.updateChildrenLabel(newNode.parent);
        this.invalidateNextNodes(newNode);
        return newNode;
    }

    removeNode(nodeToRemove: StepTreeNode | undefined) {
        this.invalidateNextNodes(nodeToRemove);
        if (nodeToRemove?.parent) {
            const nodeIndex = nodeToRemove.parent.children.indexOf(nodeToRemove);
            nodeToRemove.parent.children.splice(nodeIndex, 1);
            this.updateChildrenLabel(nodeToRemove.parent);
        } else if (nodeToRemove?.children.length) {
            nodeToRemove.children = [];
        }
    }

    moveAfterNode(nodeToMove: StepTreeNode, previousNode: StepTreeNode): StepTreeNode {
        if (nodeToMove?.step?.id === previousNode?.step?.id)
            throw ('Both nodes need to be different');
        if (!nodeToMove?.parent || !previousNode?.parent)
            throw ('Both nodes need to have a parent');
        nodeToMove.parent.children = nodeToMove.parent.children.filter(node => node.step?.id != nodeToMove.step?.id);
        nodeToMove.parent = previousNode?.parent;
        nodeToMove.parent.children.splice(nodeToMove.parent.children.indexOf(previousNode) + 1, 0, nodeToMove);
        this.updateChildrenDepth(nodeToMove);
        this.updateChildrenLabel(this.rootNode);
        this.invalidateNextNodes(this.rootNode);
        this.setCurrentNode(this.currentNode);
        return nodeToMove;
    }

    moveToSubNode(nodeToMove: StepTreeNode, parentNode: StepTreeNode): StepTreeNode {
        if (nodeToMove?.step?.id === parentNode?.step?.id)
            throw ('Both nodes need to be different');
        if (!nodeToMove?.parent)
            throw ('The node to move needs to have a parent');
        nodeToMove.parent.children = nodeToMove.parent.children.filter(node => node.step?.id != nodeToMove.step?.id);
        nodeToMove.parent = parentNode;
        parentNode.children.splice(0, 0, nodeToMove);
        this.updateChildrenDepth(nodeToMove);
        this.updateChildrenLabel(this.rootNode);
        this.invalidateNextNodes(this.rootNode);
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

    updateChildrenLabel(parentNode: StepTreeNode | undefined) {
        if (!parentNode) return;
        const baseLabel: string = (parentNode.step) ? `${parentNode.step?.label}.` : '';
        for (let i = 0; i < parentNode.children.length; i++) {
            const childNode = parentNode.children[i];
            if (childNode.step)
                childNode.step.label = baseLabel + (i + 1);
            this.updateChildrenLabel(childNode);
        }

    }

    getPreviousNode(node: StepTreeNode | undefined): StepTreeNode {
        if (node?.children.length) // The node has a child
            return node.children[node.children.length - 1];
        while (node?.parent) { // The node has a parent
            const nodeIndex = node.parent.children.indexOf(node);
            if (nodeIndex > 0) // The node has an immediate brother
                return node.parent.children[nodeIndex - 1];
            node = node.parent;
        }
        return node || this.rootNode;
    }

    executeOnNextNodes(node: StepTreeNode, func: (node: StepTreeNode) => void) {
        while (node !== undefined) {
            func(node);
            if (node.parent) { // Find the next node
                const currentNodeIndex = node.parent.children.indexOf(node);
                if (node.parent.children.length > currentNodeIndex + 1) {
                    node = node.parent.children[currentNodeIndex + 1];
                    while (node.children.length) {
                        node = node.children[0];
                    }
                } else {
                    if (!node.parent?.step)
                        return false;
                    node = node.parent;
                }
            } else {
                while (node.children.length) {
                    node = node.children[0];
                }
            }
        }
    }

    invalidateNextNodes(node: StepTreeNode | undefined) {
        if (node)
            this.executeOnNextNodes(node, (node: StepTreeNode) => { if (node?.step) node.step.resultingState = undefined; });
    }

    /**
     * Applies the next step.
     * @returns `true` if a another step was executed or `false` otherwise.
     */
    stepOnce(): boolean {
        if (this.currentNode?.step)
            this.currentNode.step.resultingState = this.playerState.clone();
        if (!this.currentNode) { // Find and execute the first node
            this.currentNode = this.rootNode;
            while (this.currentNode.children.length) {
                this.currentNode = this.currentNode.children[0];
            }
        } else if (this.currentNode.parent) { // Execute the next node
            const currentNodeIndex = this.currentNode.parent.children.indexOf(this.currentNode);
            if (this.currentNode.parent.children.length > currentNodeIndex + 1) {
                this.currentNode = this.currentNode.parent.children[currentNodeIndex + 1];
                while (this.currentNode.children.length) {
                    this.currentNode = this.currentNode.children[0];
                }
            } else {
                if (!this.currentNode.parent?.step)
                    return false;
                this.currentNode = this.currentNode.parent;
            }
        }

        if (this.currentNode.step) {
            this.currentNode.step.applyEffects(this.playerState);
            return true;
        }
        return false;
    }

    completeNode(node: StepTreeNode | undefined) {
        if (node?.step) // Complete node
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

    uncompleteNode(node: StepTreeNode | undefined) {
        if (node?.step) // Complete node
            node.step.completed = false;

        let parentNode = node?.parent;
        while (parentNode && parentNode.step?.completed) { // Uncomplete the direct parent and grand-parents
            parentNode.step.completed = false;
            parentNode = node?.parent;
        }
        if (node?.children?.length) { // Uncomplete all children recursively
            for (const childNode of node.children)
                this.uncompleteNode(childNode);
        }
    }

    toggleNodeCompletion(node: StepTreeNode | undefined) {
        if (node?.step?.completed === true)
            this.uncompleteNode(node);
        else if (node?.step?.completed === false)
            this.completeNode(node);
    }

    /**
     * Applies the next steps until the specified step is applied or until the last step.
     * @param step Once this step is executed, will return.
     */
    setCurrentNode(node: StepTreeNode | undefined) {
        if (node?.step?.resultingState) { // Load pre-processed step
            if (this.currentNode?.step)
                this.currentNode.step.resultingState = this.playerState.clone();
            this.playerState = node.step.resultingState;
            this.currentNode = node;
            return;
        } if (!this.getCurrentStep()?.resultingState) { // Re-process all steps
            this.playerState = new PlayerState();
            this.currentNode = undefined;
        }

        let wasStepExecuted = true;
        while (node?.step?.id !== this.getCurrentStep()?.id && wasStepExecuted) {
            wasStepExecuted = this.stepOnce();
        }
    }

    getStepCount(fromNode: StepTreeNode, filter?: (node: StepTreeNode) => boolean): number {
        let total = 0;
        for (const node of fromNode.children) {
            total += ((filter?.(node) ?? true) ? 1 : 0) + this.getStepCount(node, filter);
        }
        return total;
    }

    getFirstNode(): StepTreeNode {
        if (!this.rootNode.children.length)
            return this.rootNode;
        return this.rootNode.children[0];
    }

    getLastNode(): StepTreeNode {
        let node = this.rootNode;
        while (node.children.length)
            node = node.children[this.rootNode.children.length - 1];
        return node;
    }

    getFirstStep(): Step | undefined {
        return this.getFirstNode().step;
    }

    getCurrentStep(): Step | undefined {
        return this.currentNode?.step;
    }

    getLastStep(): Step | undefined {
        return this.getLastNode().step;
    }

    getPlayerState(): PlayerState {
        return this.playerState;
    }

    toString(): string {
        return Route.toString(this.rootNode);
    }

    static toString(node: StepTreeNode): string {
        let result: string = '';
        if (!node.step) result += 'root';
        else if (node.step) { // Relevant info to display about the node
            result += `${node.step.label} ${node.step.description}`
                + `, depth:${node.depth}`
                + `${node.step.effects.length ? `, ${node.step.effects.length} effects` : ''}`
                + `${node.step.completed ? ', completed' : ''}`
                + `${node.step.resultingState ? ', generated' : ''}`;
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
        return { rootNode: this.rootNode };
    }

    static fromJSON(jsonObject: { [key: string]: any }): Route {
        validatePropertyType(Route, jsonObject, 'rootNode', 'object');
        const route: Route = new Route();
        route.rootNode = StepTreeNode.fromJSON(jsonObject.rootNode);
        route.updateChildrenParent(route.rootNode);
        route.updateChildrenLabel(route.rootNode);
        return route;
    }
}
