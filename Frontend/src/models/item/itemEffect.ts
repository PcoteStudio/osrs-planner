import { Effect, EffectTypeEnum } from '../effect';
import { PlayerState } from '../playerState';
import { Item } from './item';
import { ItemContainers } from './itemContainers';

export class ItemEffect extends Effect {
  constructor(public source: ItemContainers, public destination: ItemContainers, public item: Item, public quantity: number) {
    super(EffectTypeEnum.Item);
  }

  public apply(playerState: PlayerState) {
    switch (this.source) {
      case ItemContainers.Bank:
        playerState.addWarning(...playerState.bank.moveItem(this.item, -this.quantity));
        break;
      case ItemContainers.Inventory:
        playerState.addWarning(...playerState.inventory.moveItem(this.item, -this.quantity));
        break;
      case ItemContainers.Equipment:
        if (this.item.equipmentSlot)
          playerState.equipment.swapSlot(this.item.equipmentSlot, undefined);
        break;
      default:
        break;
    }
    switch (this.destination) {
      case ItemContainers.Bank:
        playerState.addWarning(...playerState.bank.moveItem(this.item, this.quantity));
        break;
      case ItemContainers.Inventory:
        playerState.addWarning(...playerState.inventory.moveItem(this.item, this.quantity));
        break;
      case ItemContainers.Equipment:
        if (this.item.equipmentSlot)
          playerState.equipment.swapSlot(this.item.equipmentSlot, this.item);
        break;
      default:
        break;
    }
  }

  public canMergeWith(effect: Effect): boolean {
    if(effect.type != EffectTypeEnum.Item || !(effect instanceof ItemEffect)) 
      return false;
    const itemEffect = (effect as ItemEffect);
    return (itemEffect.source === this.source && itemEffect.destination === this.destination && (itemEffect.item.id === this.item.id 
        || (!this.item.isPlaceholder && !itemEffect.item.isPlaceholder && !this.item.noted && !itemEffect.item.noted
            && (this.item.linkedItemId ?? this.item.id) === (itemEffect.item.linkedItemId ?? itemEffect.item.id))));
  }

  public mergeWith(effect: Effect): void {
    if(!this.canMergeWith(effect))
      throw new Error('Incompatible effects cannot be merged together');
    this.quantity += (effect as ItemEffect).quantity;
    this.item = Item.getItemByStackSize(this.item, this.quantity);
  }

  public toJSON(): object {
    return { ...super.toJSON(), source: this.source, item: this.item, quantity: this.quantity };
  }

  public toString(): string[] {
    const effects: string[] = [];
    if (this.source !== ItemContainers.World)
      effects.push(`${ItemContainers[this.source]}: -${this.quantity} ${this.item}`);
    if (this.source !== ItemContainers.World)
      effects.push(`${ItemContainers[this.destination]}: +${this.quantity} ${this.item}`);
    return effects;
  }
}