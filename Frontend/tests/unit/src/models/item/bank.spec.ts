import { beforeEach, describe, expect, it } from 'vitest';
import { Bank, BankMissingItemWarning } from '@/models/item/bank';
import { Item } from '@/models/item/item';

describe('Bank', () => {
  let bank: Bank;
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

  beforeEach(() => {
    bank = new Bank();
  });

  describe('moveItem', () => {
    it('should deposit items', () => {
      expect(bank.moveItem(unstackableItem, 4)).toStrictEqual([]);
      expect(bank.moveItem(unstackableItem, 7)).toStrictEqual([]);
    });

    it('should empty the bank in multiple moves', () => {
      bank.moveItem(unstackableItem, 10);
      for (let i = 0; i < 10; i++)
        expect(bank.moveItem(unstackableItem, -1)).toStrictEqual([]);
    });

    it('should return an error when withdrawing missing items from the bank', () => {
      const warnings = bank.moveItem(unstackableItem, - 1);
      expect(warnings.length).toStrictEqual(1);
      expect(warnings[0]).toBeInstanceOf(BankMissingItemWarning);
    });
  });

  describe('clear', () => {
    it('should remove all items from the bank', () => {
      bank.moveItem(unstackableItem, 12);
      bank.clear();
      expect(bank.getUsedSlotsCount()).toStrictEqual(0);
    });
  });

  describe('getUsedSlotsCount', () => {
    it('should return 0 for a new bank', () => {
      expect(bank.getUsedSlotsCount()).toStrictEqual(0);
    });

    it('should return 0 for a bank missing items', () => {
      bank.moveItem(unstackableItem, -3);
      expect(bank.getUsedSlotsCount()).toStrictEqual(0);
    });

    it('should accurately unstackable items as 1', () => {
      bank.moveItem(unstackableItem, 11);
      expect(bank.getUsedSlotsCount()).toStrictEqual(1);
    });
  });

  describe('clone', () => {
    it('should return an identical copy', () => {
      bank.moveItem(stackableItem, 3);
      bank.moveItem(unstackableItem, 8);
      bank.moveItem(notedItem, 8);
      const bankClone = bank.clone();

      expect(bankClone.getSlots()).toStrictEqual(bank.getSlots());
    });

    it('should return a copy that does not mutate the original', () => {
      bank.moveItem(stackableItem, 3);
      const bankClone = bank.clone();
      bank.moveItem(stackableItem, -1);

      expect(bankClone.getItem(stackableItem)).toStrictEqual({ item: stackableItem, quantity: 3 });
      expect(bank.getItem(stackableItem)).toStrictEqual({ item: stackableItem, quantity: 2 });
    });
  });
});