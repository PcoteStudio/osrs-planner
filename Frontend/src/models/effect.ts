import { PlayerState } from './playerState';
import { SkillEffect } from './skill/skillEffect';

export abstract class Effect {
    public abstract apply(playerState: PlayerState): void;
    public abstract toString(): string[];

    constructor(public readonly type: EffectTypeEnum) {
    }

    public static fromJSON(jsonObject: any): Effect {
        let funcToCall: ((jsonObject: any) => Effect) | undefined;
        switch (jsonObject?.type) {
            case EffectTypeEnum.Skill:
                funcToCall = SkillEffect.fromJSON;
        }
        if (!funcToCall) throw new Error('Invalid effect type');
        if (funcToCall === Effect.fromJSON) throw new Error(`${jsonObject?.type}Effect.fromJSON() is not implemented`);
        return funcToCall(jsonObject);
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