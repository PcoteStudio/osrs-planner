import { JsonHelper } from '@/utils/jsonHelper';
import { Effect, EffectTypeEnum } from '../effect';
import { PlayerState } from '../playerState';
import type { ContainerItem } from './containerItem';
import { Item } from './item';
import { ItemActions } from './itemActions';
import { ItemStore } from './itemStore';
import type { ItemEffectEntity } from '@/entities/itemEffectEntity';

export class ItemEffect extends Effect {
  constructor(public action: ItemActions, public item: Item, public quantity: number) {
    super(EffectTypeEnum.Item);
  }

  public apply(playerState: PlayerState): void {
    let movedItem: ContainerItem | undefined = undefined;
    let movedItems: ContainerItem[]  = [];
    switch (this.action) {
      // From bank
      case ItemActions.Incinerate:
      case ItemActions.Withdraw:
        movedItem = playerState.bank.getItemVariation(this.item);
        playerState.addWarnings(...playerState.bank.moveItem(this.item, -this.quantity));
        break;
      // From inventory
      case ItemActions.Drop:
      case ItemActions.Bank:
      case ItemActions.Equip:
        movedItem = playerState.inventory.getItemVariation(this.item);
        playerState.addWarnings(...playerState.inventory.moveItem(this.item, -this.quantity));
        break;
      case ItemActions.Note:
        if(this.item.linkedNoted)
          movedItem = playerState.inventory.getItem(this.item) ?? { item: this.item, quantity: this.quantity };
        break;
      case ItemActions.Unnote:
        if(this.item.linkedItem)
          movedItem = playerState.inventory.getItem(this.item) ?? { item: this.item, quantity: this.quantity };
        break;
      case ItemActions.BankAll:
      case ItemActions.DropAll:
        movedItems = Object.values(playerState.inventory.items);
        playerState.inventory.clear();
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
        playerState.addWarnings(...playerState.bank.moveItem(itemToMove, quantityToMove));
        break;
      case ItemActions.BankAll:
        for (const container of movedItems) {
          if(container.quantity > 0)
            playerState.addWarnings(...playerState.bank.moveItem(container.item, container.quantity));
        } 
        break;
      // To inventory
      case ItemActions.Pickup:
      case ItemActions.Withdraw:
        playerState.addWarnings(...playerState.inventory.moveItem(itemToMove, quantityToMove));
        break;
      case ItemActions.Unequip:
        playerState.addWarnings(...playerState.inventory.moveItem(itemToMove, quantityToMove));
        break;
      case ItemActions.Note:
        playerState.addWarnings(...playerState.inventory.noteItems(itemToMove, quantityToMove));
        break;
      case ItemActions.Unnote:
        playerState.addWarnings(...playerState.inventory.unnoteItems(itemToMove, quantityToMove));
        break;
      // To equipment
      case ItemActions.Equip:
        playerState.equipment.swapSlot(itemToMove.equipmentSlot, movedItem);
        break;
      default:
        break;
    }
  }

  public canMergeWith(effect: Effect): effect is ItemEffect {
    if(effect.type !== EffectTypeEnum.Item || !(effect instanceof ItemEffect)) 
      return false;
    const itemEffect = (effect as ItemEffect);
    return (itemEffect.action === this.action && (itemEffect.item.id === this.item.id 
        || (!this.item.isPlaceholder && !itemEffect.item.isPlaceholder && !this.item.noted && !itemEffect.item.noted
            && (this.item.linkedItemId ?? this.item.id) === (itemEffect.item.linkedItemId ?? itemEffect.item.id))));
  }

  public mergeWith(effect: Effect): asserts effect is ItemEffect {
    if(!this.canMergeWith(effect))
      throw new Error('Incompatible effects cannot be merged together');
    this.quantity += effect.quantity;
    this.item = Item.getItemByStackSize(this.item, this.quantity);
  }

  public toJSON(): ItemEffectEntity {
    return { ...super.toJSON(), action: this.action, itemId: this.item.id, quantity: this.quantity };
  }

  public static fromJSON(jsonObject: { [key: string]: any }): ItemEffect {
    const parsedItemEffect = JsonHelper.parseWithSchema<ItemEffectEntity>('ItemEffectEntity', jsonObject);
    const existingItem = ItemStore.getItem(parsedItemEffect.itemId);
    if(!existingItem)
      throw new Error(`The ItemEffect item could not be found in the store ${JSON.stringify(jsonObject)}`);
    return new ItemEffect(parsedItemEffect.action, existingItem, parsedItemEffect.quantity);
  }

  public toString(): string {
    switch (this.action) {
      case ItemActions.BankAll:
        return 'Bank all items';
      case ItemActions.DropAll:
        return 'Drop all items';
      default:
        return `${this.action} ${[Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY].includes(this.quantity) ? 'all' : this.quantity} ${this.item}`;
    }
    
  }
}