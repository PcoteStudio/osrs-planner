import { Item } from '@/models/item/item';
import { ItemActions } from '@/models/item/itemActions';
import { ItemEffect } from '@/models/item/itemEffect';
import { ItemStore } from '@/models/item/itemStore';
import { SkillEffect } from '@/models/skill/skillEffect';
import { SkillsEnum } from '@/models/skill/skillsEnum';
import { beforeEach, describe, expect, it } from 'vitest';

describe('itemEffect', () => {
  const unstackableItem = new Item(100, 'unstackable item');
  unstackableItem.stackable = false;
  const stackableItem = new Item(200, 'stackable item');
  stackableItem.stackable = true;
  const unnotableItem = new Item(300, 'unnotable item');
  unnotableItem.notable = false;
  const notableItem = new Item(400, 'notable item');
  notableItem.notable = true;
  notableItem.stackable = true;
  const notedItem = new Item(401, 'noted item');
  notedItem.notable = true;
  notedItem.noted = true;
  notedItem.linkedItem = notableItem;
  notableItem.linkedNoted = notedItem;
  const unlinkedNotableItem = new Item(402, 'unlinked item');
  unlinkedNotableItem.notable = true;
  const unlinkedNotedItem = new Item(403, 'unlinked noted item');
  unlinkedNotedItem.noted = true;
  const stackableItemVariant = new Item(404, 'stackable item variant');
  stackableItemVariant.stackable = true;
  stackableItemVariant.stackSize = 1000;
  stackableItemVariant.linkedItem = stackableItem;
  stackableItemVariant.linkedItemId = stackableItem.id;
  stackableItem.linkedStackedItems.push(stackableItemVariant);

  describe('apply', () => {
    it('should ', () => {
    });
  });

  describe('canMergeWith', () => {
    it('should return false for effects with incompatible items', () => {
      const effect1: ItemEffect = new ItemEffect(ItemActions.Bank, stackableItem, 1);
      const effect2: ItemEffect = new ItemEffect(ItemActions.Bank, unstackableItem, 1);
      expect(effect1.canMergeWith(effect2)).toStrictEqual(false);
      expect(effect2.canMergeWith(effect1)).toStrictEqual(false);
    });

    it('should return false for effects with different actions', () => {
      const effect1: ItemEffect = new ItemEffect(ItemActions.Bank, stackableItem, 1);
      const effect2: ItemEffect = new ItemEffect(ItemActions.Pickup, stackableItem, 1);
      expect(effect1.canMergeWith(effect2)).toStrictEqual(false);
      expect(effect2.canMergeWith(effect1)).toStrictEqual(false);
    });

    it('should return false for effects with different effect types', () => {
      const effect1: ItemEffect = new ItemEffect(ItemActions.Bank, stackableItem, 1);
      const effect2: SkillEffect = new SkillEffect(SkillsEnum.Attack, 1);
      expect(effect1.canMergeWith(effect2)).toStrictEqual(false);
      expect(effect2.canMergeWith(effect1)).toStrictEqual(false);
    });

    it('should return true for effects with the same action and item', () => {
      const effect1: ItemEffect = new ItemEffect(ItemActions.Bank, stackableItem, 2);
      const effect2: ItemEffect = new ItemEffect(ItemActions.Bank, stackableItem, 3);
      expect(effect1.canMergeWith(effect2)).toStrictEqual(true);
      expect(effect2.canMergeWith(effect1)).toStrictEqual(true);
    });

    it('should return true for effects with the same action and compatible items', () => {
      const effect1: ItemEffect = new ItemEffect(ItemActions.Bank, stackableItem, 5);
      const effect2: ItemEffect = new ItemEffect(ItemActions.Bank, stackableItemVariant, 4);
      expect(effect1.canMergeWith(effect2)).toStrictEqual(true);
      expect(effect2.canMergeWith(effect1)).toStrictEqual(true);
    });
  });

  describe('mergeWith', () => {
    it('should throw if trying to merge effects with incompatible items', () => {
      const effect1: ItemEffect = new ItemEffect(ItemActions.Bank, stackableItem, 1);
      const effect2: ItemEffect = new ItemEffect(ItemActions.Bank, unstackableItem, 1);
      expect(() => { effect1.mergeWith(effect2); }).toThrowError();
      expect(() => { effect2.mergeWith(effect1); }).toThrowError();
    });

    it('should throw if trying to merge effects with different actions', () => {
      const effect1: ItemEffect = new ItemEffect(ItemActions.Bank, stackableItem, 1);
      const effect2: ItemEffect = new ItemEffect(ItemActions.Pickup, stackableItem, 1);
      expect(() => { effect1.mergeWith(effect2); }).toThrowError();
      expect(() => { effect2.mergeWith(effect1); }).toThrowError();
    });

    it('should throw if trying to merge effects with different effect types', () => {
      const effect1: ItemEffect = new ItemEffect(ItemActions.Bank, stackableItem, 1);
      const effect2: SkillEffect = new SkillEffect(SkillsEnum.Attack, 1);
      expect(() => { effect1.mergeWith(effect2); }).toThrowError();
    });

    it('should merge effects with the same action and item', () => {
      const effect1: ItemEffect = new ItemEffect(ItemActions.Bank, stackableItem, 2);
      const effect2: ItemEffect = new ItemEffect(ItemActions.Bank, stackableItem, 3);
      effect1.mergeWith(effect2);
      expect(effect1.action).toStrictEqual(ItemActions.Bank);
      expect(effect1.item).toStrictEqual(stackableItem);
      expect(effect1.quantity).toStrictEqual(5);
    });

    it('should merge effects with the same action and compatible items', () => {
      const effect1: ItemEffect = new ItemEffect(ItemActions.Bank, stackableItem, 5);
      const effect2: ItemEffect = new ItemEffect(ItemActions.Bank, stackableItemVariant, 4);
      effect1.mergeWith(effect2);
      expect(effect1.action).toStrictEqual(ItemActions.Bank);
      expect(effect1.item).toStrictEqual(stackableItem);
      expect(effect1.quantity).toStrictEqual(9);
    });

    it('should merge effects with the same action and compatible items and update the stack variation', () => {
      const effect1: ItemEffect = new ItemEffect(ItemActions.Bank, stackableItem, 600);
      const effect2: ItemEffect = new ItemEffect(ItemActions.Bank, stackableItemVariant, 400);
      effect1.mergeWith(effect2);
      expect(effect1.action).toStrictEqual(ItemActions.Bank);
      expect(effect1.item).toStrictEqual(stackableItemVariant);
      expect(effect1.quantity).toStrictEqual(1000);
    });
  });

  describe('toJSON & fromJSON', () => {
    beforeEach(() => {
      ItemStore.clear();
    });

    it('should be able to serialize and reconstruct the original item effect', () => {
      ItemStore.addItem(unstackableItem);
      const effect = new ItemEffect(ItemActions.Bank, unstackableItem, 1);
      const jsonEffect = JSON.stringify(effect.toJSON());
      const parsedEffect = ItemEffect.fromJSON(JSON.parse(jsonEffect));

      expect(effect).toStrictEqual(parsedEffect);
    });
  });

  describe('toString', () => {
    it('should contain the action name', () => {
      const effect = new ItemEffect(ItemActions.Bank, unstackableItem, 42);
      expect(effect.toString().toLocaleLowerCase()).toContain('bank');
    });

    it('should contain the item name', () => {
      const effect = new ItemEffect(ItemActions.Bank, unstackableItem, 42);
      expect(effect.toString()).toContain(effect.item.name);
    });

    it('should contain the quantity', () => {
      const effect = new ItemEffect(ItemActions.Bank, unstackableItem, 42);
      expect(effect.toString().toLocaleLowerCase()).toContain(42);
    });
  });
});