import { PlayerState } from './playerState';

export abstract class Effect {
    public abstract apply(playerState: PlayerState): void;
    public abstract canMergeWith(effect: Effect): boolean;
    public abstract mergeWith(effect: Effect): void;
    public abstract toString(): string[];
    public toJSON(): object {
      return { type: this.type };
    }

    constructor(public readonly type: EffectTypeEnum) {
    }
}

export enum EffectTypeEnum {
    Completion = 'Completion',
    Item = 'Item',
    Skill = 'Skill',
}
