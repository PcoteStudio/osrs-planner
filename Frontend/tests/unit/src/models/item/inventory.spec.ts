import { beforeEach, describe, expect, it } from 'vitest';
import { Inventory, InventoryLimitExceededWarning, InventoryMissingItemWarning } from '@/models/item/inventory';
import { Item } from '@/models/item/item';

describe('Inventory', () => {
    let inventory: Inventory;
    const unstackableItem: Item = new Item(3, 'unstackable-item-name');
    unstackableItem.stackable = false;
    const stackableItem: Item = new Item(3, 'stackable-item-name');
    stackableItem.stackable = true;

    beforeEach(() => {
        inventory = new Inventory(28);
    });

    describe('moveItem', () => {
        it('should be able to fill the inventory in a single move', () => {
            expect(inventory.moveItem(unstackableItem, inventory.maxSlots)).toStrictEqual([]);
        });

        it('should be able to fill the inventory in multiple moves', () => {
            for (let i = 0; i < inventory.maxSlots; i++)
                expect(inventory.moveItem(unstackableItem, 1)).toStrictEqual([]);
        });

        it('should be able to empty the inventory in a single move', () => {
            inventory.moveItem(unstackableItem, inventory.maxSlots);
            expect(inventory.moveItem(unstackableItem, -inventory.maxSlots)).toStrictEqual([]);
        });

        it('should be able to empty the inventory in multiple moves', () => {
            inventory.moveItem(unstackableItem, inventory.maxSlots);
            for (let i = 0; i < inventory.maxSlots; i++)
                expect(inventory.moveItem(unstackableItem, -1)).toStrictEqual([]);
        });

        it('should return an error when exceeding the inventory limit in a single move', () => {
            const warnings = inventory.moveItem(unstackableItem, inventory.maxSlots + 1);
            expect(warnings.length).toStrictEqual(1);
            expect(warnings[0]).toBeInstanceOf(InventoryLimitExceededWarning);
        });

        it('should return an error when exceeding the inventory limit in multiple moves', () => {
            const warningsA = inventory.moveItem(unstackableItem, inventory.maxSlots);      
            const warningsB = inventory.moveItem(unstackableItem, 1);
            expect(warningsA.length).toStrictEqual(0);
            expect(warningsB.length).toStrictEqual(1);
            expect(warningsB[0]).toBeInstanceOf(InventoryLimitExceededWarning);
        });

        it('should return an error when withdrawing missing items from the inventory', () => {
            const warnings = inventory.moveItem(unstackableItem, - 1);
            expect(warnings.length).toStrictEqual(1);
            expect(warnings[0]).toBeInstanceOf(InventoryMissingItemWarning);
        });
    });

    describe('clear', () => {
        it('should remove all items from the inventory', () => {
            inventory.moveItem(unstackableItem, inventory.maxSlots);
            inventory.clear();
            expect(inventory.usedSlots()).toStrictEqual(0);
        });
    });

    describe('usedSlots', () => {
        it('should return 0 for a new inventory', () => {
            expect(inventory.usedSlots()).toStrictEqual(0);
        });

        it('should return 1 for an inventory missing 1 item', () => {
            inventory.moveItem(unstackableItem, -1);
            expect(inventory.usedSlots()).toStrictEqual(1);
        });

        it('should return 1 for an inventory missing 3 unstackable items', () => {
            inventory.moveItem(unstackableItem, -3);
            expect(inventory.usedSlots()).toStrictEqual(1);
        });

        it('should return 1 for an inventory missing 3 stackable items', () => {
            inventory.moveItem(stackableItem, -3);
            expect(inventory.usedSlots()).toStrictEqual(1);
        });

        it('should accurately count 11 unstackable items', () => {
            inventory.moveItem(unstackableItem, 11);
            expect(inventory.usedSlots()).toStrictEqual(11);
        });

        it('should accurately count a full inventory of unstackable items', () => {
            inventory.moveItem(unstackableItem, inventory.maxSlots);
            expect(inventory.usedSlots()).toStrictEqual(inventory.maxSlots);
        });

        it('should accurately count an inventory exceeding its limit', () => {
            inventory.moveItem(unstackableItem, inventory.maxSlots * 2);
            expect(inventory.usedSlots()).toStrictEqual(inventory.maxSlots * 2);
        });
    });
});