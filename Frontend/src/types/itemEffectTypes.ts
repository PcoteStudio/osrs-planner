import type { Skill } from '@/models/skill/skill';
import type { EffectTypeEnum } from '@/models/effect';
import { Effect } from '@/models/effect';

export type EffectType =
  SkillEffectType
  | BankItemEffectType
  | QuestEffectType
  | EquipItemEffectType
  | QuantityItemEffectType
  | RemoveItemEffectType
  | NoteItemEffectType
  | AddItemEffectType
;

type SkillEffectType = {
  action?: 'Skill',
  category: EffectTypeEnum.Skill,
  data: {
    stepId: string,
    effect?: Effect,
    skill?: Skill,
  }
}
type QuestEffectType = {
  action?: 'Quest',
  category: EffectTypeEnum.Completion,
  data: {
    stepId: string,
    effect?: Effect,
  }
}

type BankItemEffectType = {
  action?: 'BankItem',
  category: EffectTypeEnum.Item,
  data: {
    stepId: string,
    effect?: Effect,
  }
}

type EquipItemEffectType = {
  action?: 'EquipItem',
  category: EffectTypeEnum.Item,
  data: {
    stepId: string,
    effect?: Effect,
  }
}
type QuantityItemEffectType = {
  action?: 'QuantityItem',
  category: EffectTypeEnum.Item,
  data: {
    stepId: string,
    effect?: Effect,
  }
}
type RemoveItemEffectType = {
  action?: 'RemoveItem',
  category: EffectTypeEnum.Item,
  data: {
    stepId: string,
    effect?: Effect,
  }
}
type NoteItemEffectType = {
  action?: 'NoteItem',
  category: EffectTypeEnum.Item,
  data: {
    stepId: string,
    effect?: Effect,
  }
}
type AddItemEffectType = {
  action?: 'AddItem',
  category: EffectTypeEnum.Item,
  data: {
    stepId: string,
    effect?: Effect,
  }
}