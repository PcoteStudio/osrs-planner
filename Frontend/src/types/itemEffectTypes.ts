import type { Skill } from '@/models/skill/skill';
import type { EffectTypeEnum } from '@/models/effect';
import { Effect } from '@/models/effect';
import type { ItemEffectTypeEnum } from '@/types/itemEffectTypeEnum';
import type { Item } from '@/models/item/item';

export type EffectType =
  SkillEffectType
  | QuestEffectType
  | ItemEffectType
;

type SkillEffectType = {
  category: EffectTypeEnum.Skill,
  data: {
    stepId: string,
    effect?: Effect,
    skill?: Skill,
  }
}
type QuestEffectType = {
  category: EffectTypeEnum.Completion,
  data: {
    stepId: string,
    effect?: Effect,
  }
}

type ItemEffectType = {
  category: EffectTypeEnum.Item,
  data: {
    stepId: string,
    action?: ItemEffectTypeEnum,
    item?: Item,
    effect?: Effect,
  }
}