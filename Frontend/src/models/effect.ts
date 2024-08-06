import { PlayerState } from './playerState';
import type { CompletionEffect } from '@/models/completionEffect';
import type { ItemEffect } from '@/models/item/itemEffect';
import type { SkillEffect } from '@/models/skill/skillEffect';

export abstract class Effect {
    public abstract apply(playerState: PlayerState): void;
    public abstract toString(): string[];
}

export const getEffectTypes = () => {
    return [
        {
            name: 'Completion',
            type: typeof CompletionEffect,
            icon: 'https://oldschool.runescape.wiki/images/Quest_point_icon.png?dc356',
        },
        {
            name: 'Item',
            type: typeof ItemEffect,
            icon: 'https://oldschool.runescape.wiki/images/Potato_with_cheese.png?64f1b',
        },
        {
            name: 'Skill',
            type: typeof SkillEffect,
            icon: 'https://oldschool.runescape.wiki/images/Stats_icon.png?1b467'
        },
    ];
};