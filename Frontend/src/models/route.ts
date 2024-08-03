import { PlayerState } from './playerState';
import { Step } from './step';

export class Route {
    playerState: PlayerState = new PlayerState();
    firstStep: Step | undefined;
    currentStep: Step | undefined; // Current step is considered already executed
    lastStep: Step | undefined;

    addStep(previousStep: Step | undefined, newStep: Step) {
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
    stepUntil(step: Step) {
        let wasStepExecuted = true;
        while (step.id !== this.currentStep?.id && wasStepExecuted) {
            wasStepExecuted = this.stepOnce();
        }
    }

}