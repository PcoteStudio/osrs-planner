import { PlayerStateModel } from './playerStateModel';
import { SkillEffectModel } from './skill/skillEffectModel';
import { SkillsEnum } from './skill/skillsEnum';
import { StepModel } from './stepModel';
import { loremIpsum } from 'lorem-ipsum';

export class RouteModel {
    playerState: PlayerStateModel = new PlayerStateModel();
    rootNode: StepTreeNode = { children: [] };
    currentNode: StepTreeNode | undefined; // Current step is considered already executed

    initializeSomeSteps() {
        let step = new StepModel('I am a top step ' + loremIpsum());
        step.addEffect(new SkillEffectModel(SkillsEnum.Agility, 100));
        step.addEffect(new SkillEffectModel(SkillsEnum.Attack, 100));
        step.addEffect(new SkillEffectModel(SkillsEnum.Construction, 100));
        step.addEffect(new SkillEffectModel(SkillsEnum.Cooking, 100));
        step.addEffect(new SkillEffectModel(SkillsEnum.Crafting, 100));
        step.addEffect(new SkillEffectModel(SkillsEnum.Defence, 100));
        step.addEffect(new SkillEffectModel(SkillsEnum.Farming, 100));
        step.addEffect(new SkillEffectModel(SkillsEnum.Firemaking, 100));
        step.addEffect(new SkillEffectModel(SkillsEnum.Fishing, 100));
        step.addEffect(new SkillEffectModel(SkillsEnum.Fletching, 100));
        step.addEffect(new SkillEffectModel(SkillsEnum.Herblore, 100));
        step.addEffect(new SkillEffectModel(SkillsEnum.Hitpoints, 100));
        step.addEffect(new SkillEffectModel(SkillsEnum.Hunter, 100));
        step.addEffect(new SkillEffectModel(SkillsEnum.Magic, 100));
        step.addEffect(new SkillEffectModel(SkillsEnum.Mining, 100));
        step.addEffect(new SkillEffectModel(SkillsEnum.Prayer, 100));
        step.addEffect(new SkillEffectModel(SkillsEnum.Ranged, 100));
        step.addEffect(new SkillEffectModel(SkillsEnum.Runecraft, 100));
        step.addEffect(new SkillEffectModel(SkillsEnum.Slayer, 100));
        step.addEffect(new SkillEffectModel(SkillsEnum.Smithing, 100));
        step.addEffect(new SkillEffectModel(SkillsEnum.Strength, 100));
        step.addEffect(new SkillEffectModel(SkillsEnum.Thieving, 100));
        step.addEffect(new SkillEffectModel(SkillsEnum.Woodcutting, 100));
        const node1 = this.addStep(step);

        step = new StepModel('I am another top step');
        step.addEffect(new SkillEffectModel(SkillsEnum.Herblore, 300));
        const node2 = this.addStep(step, node1);

        step = new StepModel('I am a child step ' + loremIpsum());
        step.addEffect(new SkillEffectModel(SkillsEnum.Attack, 2000));
        const node21 = this.addSubStep(step, node2);

        step = new StepModel('I am another child step');
        step.addEffect(new SkillEffectModel(SkillsEnum.Defence, 1500));
        const node22 = this.addStep(step, node21);

        step = new StepModel('I am a grand-child step');
        step.addEffect(new SkillEffectModel(SkillsEnum.Fishing, 30000));
        const node221 = this.addSubStep(step, node22);

        step = new StepModel('I am a grand-child step');
        step.addEffect(new SkillEffectModel(SkillsEnum.Fishing, 30000));
        const node222 = this.addStep(step, node221);

        step = new StepModel('I am a grand-child step');
        step.addEffect(new SkillEffectModel(SkillsEnum.Fishing, 30000));
        this.addStep(step, node222);

        step = new StepModel('I am a just a child step');
        step.addEffect(new SkillEffectModel(SkillsEnum.Mining, 2000));
        this.addStep(step, node22);

        step = new StepModel('I am a but a meager top step');
        step.addEffect(new SkillEffectModel(SkillsEnum.Farming, 50000));
        const node3 = this.addStep(step, node2);

        step = new StepModel('I am the last top step');
        step.addEffect(new SkillEffectModel(SkillsEnum.Smithing, 500));
        const node4 = this.addStep(step, node3);

        step = new StepModel('I am the last top step');
        step.addEffect(new SkillEffectModel(SkillsEnum.Smithing, 500));
        const node5 = this.addStep(step, node4);

        step = new StepModel('I am the last top step');
        step.addEffect(new SkillEffectModel(SkillsEnum.Smithing, 500));
        const node6 = this.addStep(step, node5);

        step = new StepModel('I am the last top step');
        step.addEffect(new SkillEffectModel(SkillsEnum.Smithing, 500));
        const node7 = this.addStep(step, node6);

        step = new StepModel('I am the last top step');
        step.addEffect(new SkillEffectModel(SkillsEnum.Smithing, 500));
        this.addStep(step, node7);

        this.stepOnce();
    }

    addStep(newStep: StepModel, previousNode?: StepTreeNode): StepTreeNode {
        const newNode: StepTreeNode = {
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
        return newNode;
    }

    addSubStep(newStep: StepModel, parentNode: StepTreeNode): StepTreeNode {
        const newNode: StepTreeNode = {
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

    /**
     * Applies the next steps until the specified step is applied or until the last step.
     * @param step Once this step is executed, will return.
     */
    stepUntil(step: StepModel) {
        let wasStepExecuted = true;
        while (step.id !== this.currentNode?.step?.id && wasStepExecuted) {
            wasStepExecuted = this.stepOnce();
        }
    }

    getStepCount(fromNode: StepTreeNode): number {
        let total = 0;
        for (const node of fromNode.children)
            total += 1 + this.getStepCount(node);
        return total;
    }

    getFirstNode(): StepTreeNode {
        if (!this.rootNode.children.length)
            return this.rootNode;
        return this.rootNode.children[0];
    }

    getFirstStep(): StepModel | undefined {
        return this.getFirstNode().step;
    }

    getCurrentStep(): StepModel | undefined {
        return this.currentNode?.step;
    }

    getLastNode(): StepTreeNode {
        let node = this.rootNode;
        while (node.children.length)
            node = node.children[this.rootNode.children.length - 1];
        return node;
    }

    getLastStep(): StepModel | undefined {
        return this.getLastNode().step;
    }
}

export type StepTreeNode = {
    step?: StepModel;
    parent?: StepTreeNode;
    children: StepTreeNode[];
};
