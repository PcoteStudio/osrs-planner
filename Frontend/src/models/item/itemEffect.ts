import { Effect, EffectTypeEnum } from '../effect';
import { PlayerState } from '../playerState';
import type { ContainerItem } from './containerItem';
import { Item } from './item';
import { ItemActions } from './itemActions';

export class ItemEffect extends Effect {
  constructor(public action: ItemActions, public item: Item, public quantity: number) {
    super(EffectTypeEnum.Item);
  }

  public apply(playerState: PlayerState) {
    let movedItem: ContainerItem | undefined = undefined;
    switch (this.action) {
      // From bank
      case ItemActions.Incinerate:
      case ItemActions.Withdraw:
        movedItem = playerState.bank.getItemVariation(this.item);
        playerState.addWarning(...playerState.bank.moveItem(this.item, -this.quantity));
        break;
      // From inventory
      case ItemActions.Drop:
      case ItemActions.Bank:
      case ItemActions.Equip:
        movedItem = playerState.inventory.getItemVariation(this.item);
        playerState.addWarning(...playerState.inventory.moveItem(this.item, -this.quantity));
        break;
      case ItemActions.Note:
        if(this.item.linkedNoted)
          movedItem = playerState.inventory.getItem(this.item) ?? { item: this.item.linkedNoted, quantity: this.quantity };
        break;
      case ItemActions.Unnote:
        if(this.item.linkedItem)
          movedItem = playerState.inventory.getItem(this.item) ?? { item: this.item.linkedItem, quantity: this.quantity };
        break;
      // From equipment
      case ItemActions.Unequip:
        movedItem = playerState.equipment.swapSlot(this.item.equipmentSlot, undefined);
        break;
      default:
        break;
    }
    
    const itemToMove = movedItem?.item ?? this.item;
    let quantityToMove = movedItem?.quantity ?? 0;
    if (this.quantity !== Number.POSITIVE_INFINITY && this.quantity !== Number.NEGATIVE_INFINITY)
      quantityToMove = this.quantity;

    switch (this.action) {
      // To bank
      case ItemActions.Bank:
        playerState.addWarning(...playerState.bank.moveItem(itemToMove, quantityToMove));
        break;
      // To inventory
      case ItemActions.Withdraw:
        playerState.addWarning(...playerState.inventory.moveItem(itemToMove, quantityToMove));
        break;
      case ItemActions.Unequip:
        playerState.addWarning(...playerState.inventory.moveItem(itemToMove, quantityToMove));
        break;
      case ItemActions.Note:
        playerState.addWarning(...playerState.inventory.noteItems(itemToMove, quantityToMove));
        break;
      case ItemActions.Unnote:
        playerState.addWarning(...playerState.inventory.unnoteItems(itemToMove, quantityToMove));
        break;
      // To equipment
      case ItemActions.Equip:
        playerState.equipment.swapSlot(itemToMove.equipmentSlot, movedItem);
        break;
      default:
        break;
    }
  }

  public canMergeWith(effect: Effect): boolean {
    if(effect.type != EffectTypeEnum.Item || !(effect instanceof ItemEffect)) 
      return false;
    const itemEffect = (effect as ItemEffect);
    return (itemEffect.action === this.action && (itemEffect.item.id === this.item.id 
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
    return { ...super.toJSON(), action: this.action, item: this.item, quantity: this.quantity };
  }

  public toString(): string[] {
    const effects: string[] = [];
    effects.push(`${this.action} ${[Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY].includes(this.quantity) ? 'all' : this.quantity} ${this.item}`);
    return effects;
  }
}