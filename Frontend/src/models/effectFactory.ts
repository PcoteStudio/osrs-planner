import { EffectTypeEnum, type Effect } from './effect';
import { SkillEffect } from './skill/skillEffect';

export class EffectFactory {
    static fromJSON(jsonObject: { [key: string]: any }): Effect {
        switch (jsonObject?.type) {
            case EffectTypeEnum.Skill:
                return SkillEffect.fromJSON(jsonObject);
        }
        throw new Error(`${jsonObject?.type}Effect.fromJSON() is not implemented`);
    }
}