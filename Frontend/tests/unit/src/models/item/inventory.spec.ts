import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { Inventory, InventoryLimitExceededWarning, InventoryMissingItemWarning } from '@/models/item/inventory';
import { Item } from '@/models/item/item';

describe('Inventory', () => {
    let inventory: Inventory;
    const inventorySize = 28;
    const unstackableItemId = 42;

    beforeAll(() => {
        const unstackableItem = new Item();
        unstackableItem.id = unstackableItemId;
        unstackableItem.stackable = false;
        Item.set(unstackableItem);
    });

    afterAll(() => {
        Item.clear();
    });

    beforeEach(() => {
        inventory = new Inventory(inventorySize);
    });

    describe('moveItem', () => {
        it('should be able to fill the inventory in a single move', () => {
            expect(inventory.moveItem(unstackableItemId, inventorySize)).toEqual(undefined);
        });

        it('should be able to fill the inventory in multiple moves', () => {
            for (let i = 0; i < inventorySize; i++)
                expect(inventory.moveItem(unstackableItemId, 1)).toEqual(undefined);
        });

        it('should be able to empty the inventory in a single move', () => {
            inventory.moveItem(unstackableItemId, inventorySize);
            expect(inventory.moveItem(unstackableItemId, -inventorySize)).toEqual(undefined);
        });

        it('should be able to empty the inventory in multiple moves', () => {
            inventory.moveItem(unstackableItemId, inventorySize);
            for (let i = 0; i < inventorySize; i++)
                expect(inventory.moveItem(unstackableItemId, -1)).toEqual(undefined);
        });

        it('should return an error when exceeding the inventory limit in a single move', () => {
            expect(inventory.moveItem(unstackableItemId, inventorySize + 1)).toBeInstanceOf(InventoryLimitExceededWarning);
        });

        it('should return an error when exceeding the inventory limit in multiple moves', () => {
            expect(inventory.moveItem(unstackableItemId, inventorySize)).toEqual(undefined);
            expect(inventory.moveItem(unstackableItemId, 1)).toBeInstanceOf(InventoryLimitExceededWarning);
        });

        it('should return an error when withdrawing missing items from the inventory', () => {
            expect(inventory.moveItem(unstackableItemId, - 1)).toBeInstanceOf(InventoryMissingItemWarning);
        });
    });

    describe('clear', () => {
        it('should remove all items from the inventory', () => {
            inventory.moveItem(unstackableItemId, inventorySize);
            inventory.clear();
            expect(inventory.usedSlots()).toEqual(0);
        });
    });

    describe('usedSlots', () => {
        it('should return 0 for a new inventory', () => {
            expect(inventory.usedSlots()).toEqual(0);
        });

        it('should return 0 for an inventory missing items', () => {
            inventory.moveItem(unstackableItemId, -3);
            expect(inventory.usedSlots()).toEqual(0);
        });

        it('should accurately count 11 unstackable items', () => {
            inventory.moveItem(unstackableItemId, 11);
            expect(inventory.usedSlots()).toEqual(11);
        });

        it('should accurately count a full inventory of unstackable items', () => {
            inventory.moveItem(unstackableItemId, inventorySize);
            expect(inventory.usedSlots()).toEqual(inventorySize);
        });

        it('should accurately count an inventory exceeding its limit', () => {
            inventory.moveItem(unstackableItemId, inventorySize * 2);
            expect(inventory.usedSlots()).toEqual(inventorySize * 2);
        });
    });
});