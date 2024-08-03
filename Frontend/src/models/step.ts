import { nanoid } from 'nanoid';
import type { Effect } from './effect';
import type { PlayerState } from './playerState';

export class Step {
    id: string = nanoid();
    depth: number = 0;
    description: string = '';
    effects: Effect[] = [];
    previous: Step | undefined;
    next: Step | undefined;

    applyEffects(playerState: PlayerState) {
        for (const effect of this.effects) {
            effect.apply(playerState);
        }
    }
}