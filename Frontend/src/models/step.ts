import { nanoid } from 'nanoid';
import type { PlayerState } from './playerState';
import type { Effect } from '@/models/effect';

export class Step {
    id: string = nanoid();
    resultingState: PlayerState | undefined;
    description: string = '';
    effects: Effect[] = [];
    completed: boolean = false;

    constructor(description: string) {
        this.description = description;
    }

    addEffect(effect: Effect) {
        if (effect) this.effects.push(effect);
    }

    applyEffects(playerState: PlayerState) {
        for (const effect of this.effects) {
            effect.apply(playerState);
        }
    }
}