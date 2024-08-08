import { nanoid } from 'nanoid';
import { PlayerState } from './playerState';
import { Effect } from '@/models/effect';
import { validatePropertyIterability, validatePropertyType } from '@/utils/parsingValidators';
import { EffectFactory } from './effectFactory';
import { SkillEffect } from './skill/skillEffect';

export class Step {
    id: string = nanoid();
    label: string = '?';
    resultingState: PlayerState | undefined;
    description: string = '';
    effects: Effect[] = [];
    completed: boolean = false;

    constructor(description: string) {
        this.description = description;
    }

    addEffect(effect: Effect | undefined) {
        // Merge similar effects together
        if (effect instanceof SkillEffect) {
            const skillEffect = effect as SkillEffect;
            for (const existingEffect of this.effects) {
                if (existingEffect instanceof SkillEffect) {
                    const existingSkillEffect = existingEffect as SkillEffect;
                    if (skillEffect.skill == existingSkillEffect.skill) {
                        existingSkillEffect.experience += skillEffect.experience;
                        return;
                    }
                }
            }
        }
        // Add the effect otherwise
        if (effect) this.effects.push(effect);
    }

    removeEffect(effect: Effect) {
        const effectIndex = this.effects.indexOf(effect);
        if (effectIndex >= 0)
            this.effects.splice(effectIndex, 1);
    }

    applyEffects(playerState: PlayerState) {
        for (const effect of this.effects) {
            effect.apply(playerState);
        }
    }

    toJSON() {
        return { id: this.id, description: this.description, effects: this.effects, completed: this.completed };
    }

    static fromJSON(jsonObject: { [key: string]: any }): Step {
        validatePropertyType(Step, jsonObject, 'id', 'string'); // TODO remove ID from export and update tests
        validatePropertyType(Step, jsonObject, 'description', 'string');
        validatePropertyType(Step, jsonObject, 'completed', 'boolean');
        validatePropertyIterability(Step, jsonObject, 'effects');
        const step = new Step(jsonObject.description);
        step.completed = jsonObject.completed;
        step.id = jsonObject.id;
        for (const effect of jsonObject.effects)
            step.addEffect(EffectFactory.fromJSON(effect));
        return step;
    }

    public toString(): string {
        return `${this.label}`;
    }
}