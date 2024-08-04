import { nanoid } from 'nanoid';
import type { PlayerStateModel } from './playerStateModel';
import type { EffectModel } from '@/models/effectModel';

export class StepModel {
    id: string = nanoid();
    description: string = '';
    effects: EffectModel[] = [];
    completed: boolean = false;

    constructor(description: string) {
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