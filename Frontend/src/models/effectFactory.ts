import { JsonHelper } from '@/utils/jsonHelper';
import { EffectTypeEnum, type Effect } from './effect';
import { SkillEffect } from './skill/skillEffect';

export class EffectFactory {
  static fromJSON(jsonObject: Record<string, any>): Effect {
    const effect = JsonHelper.parseWithSchema<Effect>('Effect', jsonObject);
    switch (effect.type) {
      case EffectTypeEnum.Skill:
        return SkillEffect.fromJSON(jsonObject);
    }
    throw new Error(`${jsonObject.type}Effect.fromJSON() is not implemented`);
  }
}