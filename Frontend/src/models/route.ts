import { PlayerState } from "./playerState";
import { Step } from "./step";

export class Route {
    playerState: PlayerState = new PlayerState();
    firstStep: Step = new Step();
    currentStep: Step | undefined = undefined;
    lastStep: Step = this.firstStep;

    stepOnce() {
        if (!this.currentStep) this.currentStep = this.firstStep;
        this.firstStep.effect?.apply(this.playerState);
    }

    stepUntil(step: Step) {
        do {
            this.stepOnce();
        } while (step.id !== this.currentStep?.id && this.lastStep.id !== this.currentStep?.id);
    }
}