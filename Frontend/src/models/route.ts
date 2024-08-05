import { PlayerState } from './playerState';
import { SkillEffect } from './skill/skillEffect';
import { SkillsEnum } from './skill/skillsEnum';
import { Step } from './step';
import { loremIpsum } from 'lorem-ipsum';

export class Route {
    playerState: PlayerState = new PlayerState();
    rootNode: StepTreeNode = { depth: -1, children: [] };
    currentNode: StepTreeNode | undefined; // Current step is considered already executed

    initializeSomeSteps() {
        let step = new Step('I am a top step ' + loremIpsum());
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
        const node1 = this.addStep(step);

        step = new Step('I am another top step');
        step.addEffect(new SkillEffect(SkillsEnum.Herblore, 300));
        const node2 = this.addStep(step, node1);

        step = new Step('I am a child step ' + loremIpsum());
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
        const newNode: StepTreeNode = {
            depth: previousNode?.parent ? previousNode?.parent?.depth + 1 : 0,
            step: newStep,
            children: [],
        };
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
        return newNode;
    }

    addSubStep(newStep: Step, parentNode: StepTreeNode): StepTreeNode {
        const newNode: StepTreeNode = {
            depth: parentNode.depth + 1,
            step: newStep,
            parent: parentNode,
            children: [],
        };
        parentNode.children.splice(0, 0, newNode);
        return newNode;
    }

    /**
     * Applies the next step.
     * @returns `true` if a another step was executed or `false` otherwise.
     */
    stepOnce(): boolean {
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
                this.currentNode = this.currentNode.parent;
            }
        }

        if (this.currentNode.step) {
            this.currentNode.step.applyEffects(this.playerState);
            return true;
        }
        return false; // There is only a root node left to execute
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
            this.completeNode(node.children[node.children.length - 1]);
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
    setCurrentStep(step: Step | undefined) {
        // TODO don't reprocess it all every time
        this.playerState = new PlayerState();
        this.currentNode = undefined;
        let wasStepExecuted = true;
        while (step?.id !== this.getCurrentStep()?.id && wasStepExecuted) {
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
}

export type StepTreeNode = {
    step?: Step;
    depth: number;
    parent?: StepTreeNode;
    children: StepTreeNode[];
};
