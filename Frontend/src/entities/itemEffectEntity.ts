import type { ItemActions } from '@/models/item/itemActions';
import type { EffectEntity } from './effectEntity';

export type ItemEffectEntity = EffectEntity & {
  action: ItemActions,
  itemId: number,
  quantity: number
}