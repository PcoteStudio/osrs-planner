import { PlayerStateModel } from './playerStateModel';
import { SkillEffectModel } from './skill/skillEffectModel';
import { SkillsModel } from './skill/skillsModel';
import { StepModel } from './stepModel';

export class RouteModel {
    playerState: PlayerStateModel = new PlayerStateModel();
    firstStep: StepModel | undefined;
    currentStep: StepModel | undefined; // Current step is considered already executed
    lastStep: StepModel | undefined;

    initializeSomeSteps() {
        let step = new StepModel(0, 'I am a top step');
        step.addEffect(new SkillEffectModel(SkillsModel.Agility, 100));
        this.addStep(undefined, step);
        step = new StepModel(0, 'I am another top step');
        step.addEffect(new SkillEffectModel(SkillsModel.Herblore, 300));
        this.addStep(this.lastStep, step);
        step = new StepModel(1, 'I am a child step');
        step.addEffect(new SkillEffectModel(SkillsModel.Attack, 2000));
        this.addStep(this.lastStep, step);
        step = new StepModel(1, 'I am another child step');
        step.addEffect(new SkillEffectModel(SkillsModel.Defence, 1500));
        this.addStep(this.lastStep, step);
        step = new StepModel(2, 'I am a grand-child step');
        step.addEffect(new SkillEffectModel(SkillsModel.Fishing, 30000));
        this.addStep(this.lastStep, step);
        step = new StepModel(1, 'I am a just a child step');
        step.addEffect(new SkillEffectModel(SkillsModel.Mining, 2000));
        this.addStep(this.lastStep, step);
        step = new StepModel(0, 'I am a but a meager top step');
        step.addEffect(new SkillEffectModel(SkillsModel.Farming, 50000));
        this.addStep(this.lastStep, step);
        step = new StepModel(0, 'I am the last top step');
        step.addEffect(new SkillEffectModel(SkillsModel.Smithing, 500));
        this.addStep(this.lastStep, step);
    }

    addStep(previousStep: StepModel | undefined, newStep: StepModel) {
        if (newStep === undefined) return;

        if (!previousStep) { // New step is first
            const existingStep = this.firstStep;
            this.firstStep = newStep;
            newStep.next = existingStep;
        } else {    // New step is not first
            const existingStep = previousStep.next;
            previousStep.next = newStep;
            newStep.previous = previousStep;
            newStep.next = existingStep;
        }

        if (newStep.next === undefined) // New step is last
            this.lastStep = newStep;
        else // New step is not last
            newStep.next.previous = newStep;

        // Put at the right position in the parent's children list
        if (newStep.depth > 0 && newStep.previous) {
            let brothersMet = 0;
            let step: StepModel | undefined = newStep.previous;
            while (step?.depth || 0 >= newStep.depth) {
                if (step?.depth == newStep.depth)
                    brothersMet++;
                step = step?.previous;
            }
            if (step)
                step.children.splice(brothersMet, 0, newStep);
        }
    }

    /**
     * Applies the next step.
     * @returns `true` if a another step was executed or `false` otherwise.
     */
    stepOnce(): boolean {
        if (!this.currentStep && this.firstStep)
            this.currentStep = this.firstStep;
        else if (this.currentStep?.next)
            this.currentStep = this.currentStep.next;
        else
            return false;
        this.currentStep.applyEffects(this.playerState);
        return true;
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

}