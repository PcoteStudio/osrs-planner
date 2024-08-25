import { EffectTypeEnum } from '@/models/effect';

export type EffectCategory = {
  name: string,
  type: EffectTypeEnum,
  icon: string,
}

export const CompletionCategory: EffectCategory = {
  name: 'Completion',
  type: EffectTypeEnum.Completion,
  icon: 'https://oldschool.runescape.wiki/images/Quest_point_icon.png?dc356',
};

export const ItemCategory: EffectCategory = {
  name: 'Item',
  type: EffectTypeEnum.Item,
  icon: 'https://oldschool.runescape.wiki/images/Potato_with_cheese.png?64f1b',
};

export const SkillCategory: EffectCategory = {
  name: 'Skill',
  type: EffectTypeEnum.Skill,
  icon: 'https://oldschool.runescape.wiki/images/Stats_icon.png?1b467'
};

export const getEffectCategories = () : EffectCategory[] => [
  CompletionCategory,
  ItemCategory,
  SkillCategory,
];