import { nanoid } from 'nanoid';
import { PlayerState } from './playerState';
import { Effect } from '@/models/effect';

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

    static fromJSON(jsonObject: any): Step {
        const step = new Step(jsonObject.description || '');
        if (typeof jsonObject.completed !== 'boolean')
            throw new Error(`Invalid completed value when parsing step: ${jsonObject.completed}`);
        step.completed = jsonObject.completed;
        step.id = jsonObject.id || step.id;
        for (const effect of jsonObject.effects) {
            step.addEffect(Effect.fromJSON(effect));
        }
        return step;
    }

    toJSON() {
        return { id: this.id, description: this.description, effects: this.effects, completed: this.completed };
    }
}