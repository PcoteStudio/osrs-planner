import { PlayerState } from './playerState';

export abstract class Effect {
    public abstract apply(playerState: PlayerState): void;
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

export const getEffectTypes = () => {
    return [
        {
            name: 'Completion',
            type: EffectTypeEnum.Completion,
            icon: 'https://oldschool.runescape.wiki/images/Quest_point_icon.png?dc356',
        },
        {
            name: 'Item',
            type: EffectTypeEnum.Item,
            icon: 'https://oldschool.runescape.wiki/images/Potato_with_cheese.png?64f1b',
        },
        {
            name: 'Skill',
            type: EffectTypeEnum.Skill,
            icon: 'https://oldschool.runescape.wiki/images/Stats_icon.png?1b467'
        },
    ];
};