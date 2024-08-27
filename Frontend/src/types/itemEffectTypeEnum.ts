import { SkillsEnum } from '@/models/skill/skillsEnum';

export enum ItemEffectTypeEnum {
  Add = 'Add',
  Bank = 'Bank',
  Equip = 'Equip',
  Quantity = 'Quantity',
  Remove = 'Remove',
  Note = 'Note'
}

export const getItemEffectTypeOptions = (type: ItemEffectTypeEnum) => {
  switch (type) {
    case ItemEffectTypeEnum.Add:
      return {
        label: 'Add',
        icon: 'plus',
      };
    case ItemEffectTypeEnum.Bank:
      return {
        label: 'Bank',
        icon: 'building-columns',
      };
    case ItemEffectTypeEnum.Equip:
      return {
        label: 'Equip',
        icon: 'shirt',
      };
    case ItemEffectTypeEnum.Note:
      return {
        label: 'Note',
        icon: 'note-sticky',
      };
    case ItemEffectTypeEnum.Quantity:
      return {
        label: 'Quantity',
        icon: 'pen-to-square',
      };
    case ItemEffectTypeEnum.Remove:
      return {
        label: 'Remove',
        icon: 'trash',
      };
  }
};