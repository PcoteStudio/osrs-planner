import { nanoid } from 'nanoid';
import type { EffectModel } from './effectModel';
import type { PlayerStateModel } from './playerStateModel';

export class StepModel {
    id: string = nanoid();
    depth: number = 0;
    description: string = '';
    effects: EffectModel[] = [];
    previous: StepModel | undefined;
    next: StepModel | undefined;
    children: StepModel[] = [];

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