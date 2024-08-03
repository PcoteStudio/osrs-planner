import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { BankModel, BankMissingItemWarning } from '../../../../../src/models/item/bankModel';
import { ItemModel } from '../../../../../src/models/item/itemModel';

describe('Bank', () => {
    let bank: BankModel;
    const itemId = 42;

    beforeAll(() => {
        const item = new ItemModel();
        item.id = itemId;
        ItemModel.set(item);
    });

    afterAll(() => {
        ItemModel.clear();
    });

    beforeEach(() => {
        bank = new BankModel();
    });

    describe('moveItem', () => {
        it('should be able to deposit items', () => {
            expect(bank.moveItem(itemId, 4)).toEqual(undefined);
            expect(bank.moveItem(itemId, 7)).toEqual(undefined);
        });

        it('should be able to empty the bank in multiple moves', () => {
            bank.moveItem(itemId, 10);
            for (let i = 0; i < 10; i++)
                expect(bank.moveItem(itemId, -1)).toEqual(undefined);
        });

        it('should return an error when withdrawing missing items from the inventory', () => {
            expect(bank.moveItem(itemId, - 1)).toBeInstanceOf(BankMissingItemWarning);
        });
    });

    describe('clear', () => {
        it('should remove all items from the bank', () => {
            bank.moveItem(itemId, 12);
            bank.clear();
            expect(bank.usedSlots()).toEqual(0);
        });
    });

    describe('usedSlots', () => {
        it('should return 0 for a new bank', () => {
            expect(bank.usedSlots()).toEqual(0);
        });

        it('should return 0 for a bank missing items', () => {
            bank.moveItem(itemId, -3);
            expect(bank.usedSlots()).toEqual(0);
        });

        it('should accurately unstackable items as 1', () => {
            bank.moveItem(itemId, 11);
            expect(bank.usedSlots()).toEqual(1);
        });
    });
});