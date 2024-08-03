import { PlayerStateModel } from './playerStateModel';
import { StepModel } from './stepModel';

export class RouteModel {
    playerState: PlayerStateModel = new PlayerStateModel();
    firstStep: StepModel | undefined;
    currentStep: StepModel | undefined; // Current step is considered already executed
    lastStep: StepModel | undefined;

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