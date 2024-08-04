import { PlayerStateModel } from './playerStateModel';
import { SkillEffectModel } from './skill/skillEffectModel';
import { SkillsEnum } from './skill/skillsEnum';
import { StepModel } from './stepModel';
import { loremIpsum } from 'lorem-ipsum';

export class RouteModel {
    playerState: PlayerStateModel = new PlayerStateModel();
    steps: StepModel[] = [];
    currentStepIndex: number | undefined; // Current step is considered already executed
    get currentStep(): StepModel | undefined {
        if (this.currentStepIndex === undefined)
            return undefined;
        return this.steps[this.currentStepIndex];
    }

    initializeSomeSteps() {
        let step = new StepModel(0, 'I am a top step ' + loremIpsum());
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
        this.addStep(step);
        step = new StepModel(0, 'I am another top step');
        step.addEffect(new SkillEffectModel(SkillsEnum.Herblore, 300));
        this.addStep(step);
        step = new StepModel(1, 'I am a child step ' + loremIpsum());
        step.addEffect(new SkillEffectModel(SkillsEnum.Attack, 2000));
        this.addStep(step);
        step = new StepModel(1, 'I am another child step');
        step.addEffect(new SkillEffectModel(SkillsEnum.Defence, 1500));
        this.addStep(step);
        step = new StepModel(2, 'I am a grand-child step');
        step.addEffect(new SkillEffectModel(SkillsEnum.Fishing, 30000));
        this.addStep(step);
        step = new StepModel(2, 'I am a grand-child step');
        step.addEffect(new SkillEffectModel(SkillsEnum.Fishing, 30000));
        this.addStep(step);
        step = new StepModel(2, 'I am a grand-child step');
        step.addEffect(new SkillEffectModel(SkillsEnum.Fishing, 30000));
        this.addStep(step);
        step = new StepModel(1, 'I am a just a child step');
        step.addEffect(new SkillEffectModel(SkillsEnum.Mining, 2000));
        this.addStep(step);
        step = new StepModel(0, 'I am a but a meager top step');
        step.addEffect(new SkillEffectModel(SkillsEnum.Farming, 50000));
        this.addStep(step);
        step = new StepModel(0, 'I am the last top step');
        step.addEffect(new SkillEffectModel(SkillsEnum.Smithing, 500));
        this.addStep(step);
        step = new StepModel(0, 'I am the last top step');
        step.addEffect(new SkillEffectModel(SkillsEnum.Smithing, 500));
        this.addStep(step);
        step = new StepModel(0, 'I am the last top step');
        step.addEffect(new SkillEffectModel(SkillsEnum.Smithing, 500));
        this.addStep(step);
        step = new StepModel(0, 'I am the last top step');
        step.addEffect(new SkillEffectModel(SkillsEnum.Smithing, 500));
        this.addStep(step);
        step = new StepModel(0, 'I am the last top step');
        step.addEffect(new SkillEffectModel(SkillsEnum.Smithing, 500));
        this.addStep(step);
        step = new StepModel(0, 'I am the last top step');
        step.addEffect(new SkillEffectModel(SkillsEnum.Smithing, 500));
        this.addStep(step);
        step = new StepModel(0, 'I am the last top step');
        step.addEffect(new SkillEffectModel(SkillsEnum.Smithing, 500));
        this.addStep(step);
    }

    addStep(newStep: StepModel, previousStep?: StepModel | null) {
        let insertIndex: number = -1;
        if (previousStep) {
            insertIndex = this.steps.indexOf(previousStep) + 1;
        } else if (previousStep === null) { // Maybe use append/prepend method instead to add at the end or at the begining ?
            insertIndex = 0;
        }

        if (insertIndex >= 0) {
            this.steps.splice(insertIndex, 0, newStep);
        } else {
            this.steps.push(newStep);
        }
    }

    /**
     * Applies the next step.
     * @returns `true` if a another step was executed or `false` otherwise.
     */
    stepOnce(): boolean {
        if (this.currentStepIndex === undefined) {
            this.currentStepIndex = 0;
        }
        if (this.currentStepIndex + 1 < this.steps.length) {
            this.currentStepIndex++;
            this.currentStep!.applyEffects(this.playerState);
            return true;
        }
        return false;
    }

    /**
     * Applies the next steps until the specified step is applied or until the last step.
     * @param step Once this step is executed, will return.
     */
    stepUntil(step: StepModel) {
        let wasStepExecuted = true;
        while (step.id !== this.currentStep?.id && wasStepExecuted) {
            wasStepExecuted = this.stepOnce();
        }
    }

    toTree(): StepTreeNode[] {
        return this.toTreeRec(0, 0).nodes;
    }

    toTreeRec(start: number, depth: number): { position: number, nodes: StepTreeNode[] } {
        const stepNodes: StepTreeNode[] = [];
        let lastStepNode: StepTreeNode | undefined = undefined;
        let i = start;
        for (; i < this.steps.length; i++) {
            const step = this.steps[i];
            if (step.depth < depth) {
                return { position: i - 1, nodes: stepNodes };
            }
            if (step.depth === depth) {
                lastStepNode = { step, children: [] };
                stepNodes.push(lastStepNode);
            } else {
                if (lastStepNode) {
                    const { position, nodes } = this.toTreeRec(i, depth + 1);
                    lastStepNode.children = nodes;
                    i = position;
                } else {
                    throw new Error(`Trying to insert a node at depth ${step.depth} but no step was inserted before at depth ${step.depth - 1}`);
                }
            }
        }
        return { position: i, nodes: stepNodes };
    }

}

export type StepTreeNode = {
    step: StepModel
    children: StepTreeNode[];
};
