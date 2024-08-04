import { nanoid } from 'nanoid';
import type { PlayerStateModel } from './playerStateModel';
import type {EffectModel} from "@/models/effectModel";

export class StepModel {
    id: string = nanoid();
    depth: number = 0;
    description: string = '';
    effects: EffectModel[] = [];

    constructor(depth: number, description: string) {
        this.depth = depth;
        this.description = description;
    }

    addEffect(effect: EffectModel) {
        if (effect) this.effects.push(effect);
    }

    applyEffects(playerState: PlayerStateModel) {
        for (const effect of this.effects) {
            effect.apply(playerState);
        }
    }
}