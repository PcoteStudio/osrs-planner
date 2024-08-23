import { beforeEach, describe, expect, it } from 'vitest';
import { Bank, BankMissingItemWarning } from '@/models/item/bank';
import { Item } from '@/models/item/item';

describe('Bank', () => {
  let bank: Bank;
  const itemId = 42;
  const item = new Item(itemId, 'some-item-name');

  beforeEach(() => {
    bank = new Bank();
  });

  describe('moveItem', () => {
    it('should be able to deposit items', () => {
      expect(bank.moveItem(item, 4)).toStrictEqual([]);
      expect(bank.moveItem(item, 7)).toStrictEqual([]);
    });

    it('should be able to empty the bank in multiple moves', () => {
      bank.moveItem(item, 10);
      for (let i = 0; i < 10; i++)
        expect(bank.moveItem(item, -1)).toStrictEqual([]);
    });

    it('should return an error when withdrawing missing items from the inventory', () => {
      const warnings = bank.moveItem(item, - 1);
      expect(warnings.length).toStrictEqual(1);
      expect(warnings[0]).toBeInstanceOf(BankMissingItemWarning);
    });
  });

  describe('clear', () => {
    it('should remove all items from the bank', () => {
      bank.moveItem(item, 12);
      bank.clear();
      expect(bank.usedSlots()).toStrictEqual(0);
    });
  });

  describe('usedSlots', () => {
    it('should return 0 for a new bank', () => {
      expect(bank.usedSlots()).toStrictEqual(0);
    });

    it('should return 0 for a bank missing items', () => {
      bank.moveItem(item, -3);
      expect(bank.usedSlots()).toStrictEqual(0);
    });

    it('should accurately unstackable items as 1', () => {
      bank.moveItem(item, 11);
      expect(bank.usedSlots()).toStrictEqual(1);
    });
  });
});