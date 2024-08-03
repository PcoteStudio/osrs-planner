import { nanoid } from 'nanoid';
import type { Effect } from "./effect";

export class Step {
    id: string = nanoid();
    depth: number = 0;
    description: string = '';
    effect: Effect | undefined;
    previousStep: Step | undefined;
    nextStep: Step | undefined;
}