export enum ItemEffectTypeEnum {
  Pickup = 'Pickup',
  Bank = 'Bank',
  Withdraw = 'Withdraw',
  Equip = 'Equip',
  Drop = 'Drop',
  Note = 'Note',
  Incinerate = 'Incinerate',
}

export const getItemEffectTypeOptions = (type: ItemEffectTypeEnum) => {
  switch (type) {
    case ItemEffectTypeEnum.Bank:
      return {
        label: 'Bank',
        icon: 'building',
        category: 'inventory',
      };
    case ItemEffectTypeEnum.Withdraw:
      return {
        label: 'Withdraw',
        icon: 'building-circle-arrow-right',
        category: 'bank',
      };
    case ItemEffectTypeEnum.Incinerate:
      return {
        label: 'Incinerate',
        icon: 'building-circle-xmark',
        category: 'bank',
      };
    case ItemEffectTypeEnum.Equip:
      return {
        label: 'Equip',
        icon: 'plus',
        category: 'gear',
      };
    case ItemEffectTypeEnum.Pickup:
      return {
        label: 'Pickup',
        icon: 'plus',
        category: 'inventory',
      };
    case ItemEffectTypeEnum.Drop:
      return {
        label: 'Drop',
        icon: 'trash',
        category: 'inventory',
      };
    case ItemEffectTypeEnum.Note:
      return {
        label: 'Note',
        icon: 'note-sticky',
        category: 'inventory',
      };
  }
};