import { randomUUID, type UUID } from "crypto";
import type { Effect } from "./effect";

export class Step {
    id: UUID = randomUUID();
    depth: number = 0;
    description: string = '';
    effect: Effect | undefined;
    previousStep: Step | undefined;
    nextStep: Step | undefined;
}