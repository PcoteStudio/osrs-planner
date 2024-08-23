import { beforeEach, describe, expect, it } from 'vitest';
import { Inventory, InventoryLimitExceededWarning, InventoryMissingItemWarning } from '@/models/item/inventory';
import { Item } from '@/models/item/item';
import coinsJson from '../../../../data/coins.json';
import { ItemStore } from '@/models/item/itemStore';

describe('Inventory', () => {
    let inventory: Inventory;
    const unstackableItem: Item = new Item(100, 'unstackable item');
    unstackableItem.stackable = false;
    const stackableItem: Item = new Item(200, 'stackable item');
    stackableItem.stackable = true;
    const unnotableItem: Item = new Item(300, 'unnotable item');
    unnotableItem.notable = false;
    const notableItem: Item = new Item(400, 'notable item');
    notableItem.notable = true;
    notableItem.stackable = true;
    const notedItem: Item = new Item(401, 'noted item');
    notedItem.notable = true;
    notedItem.noted = true;
    notedItem.linkedItem = notableItem;
    notableItem.linkedNoted = notedItem;
    const unlinkedNotableItem: Item = new Item(402, 'unlinked item');
    unlinkedNotableItem.notable = true;
    const unlinkedNotedItem: Item = new Item(403, 'unlinked noted item');
    unlinkedNotedItem.noted = true;

    beforeEach(() => {
        inventory = new Inventory(28);
    });

    describe('noteItems', () => {
        it('should replace 1 item with 1 noted item', () => {
            inventory.moveItem(notableItem, 1);
            const warnings = inventory.noteItems(notableItem, 1);
            const slots = inventory.getSlots();

            expect(warnings.length).toStrictEqual(0);
            expect(slots.length).toStrictEqual(1);
            expect(slots).toContainEqual({ item: notedItem, quantity: 1 });
        });

        it('should replace 3 items with 3 noted items', () => {
            inventory.moveItem(notableItem, 3);
            const warnings = inventory.noteItems(notableItem, 3);
            const slots = inventory.getSlots();

            expect(warnings.length).toStrictEqual(0);
            expect(slots.length).toStrictEqual(1);
            expect(slots).toContainEqual({ item: notedItem, quantity: 3 });
        });

        it('should replace 2/3 items with noted items and leave 1 untouched', () => {
            inventory.moveItem(notableItem, 3);
            const warnings = inventory.noteItems(notableItem, 2);
            const slots = inventory.getSlots();

            expect(warnings.length).toStrictEqual(0);
            expect(slots.length).toStrictEqual(2);
            expect(slots).toContainEqual({ item: notedItem, quantity: 2 });
            expect(slots).toContainEqual({ item: notableItem, quantity: 1 });
        });

        it('should return a warning if the inventory doesn\'t contain the notable item', () => {
            const warnings = inventory.noteItems(notableItem, 2);
            const slots = inventory.getSlots();

            expect(warnings.length).toStrictEqual(1);
            expect(warnings[0]).toBeInstanceOf(InventoryMissingItemWarning);
            expect(slots.length).toStrictEqual(2);
            expect(slots).toContainEqual({ item: notedItem, quantity: 2 });
            expect(slots).toContainEqual({ item: notableItem, quantity: -2 });
        });

        it('should return a warning if the inventory doesn\'t contain enough of the notable item', () => {
            inventory.moveItem(notableItem, 2);
            const warnings = inventory.noteItems(notableItem, 3);
            const slots = inventory.getSlots();

            expect(warnings.length).toStrictEqual(1);
            expect(warnings[0]).toBeInstanceOf(InventoryMissingItemWarning);
            expect(slots.length).toStrictEqual(2);
            expect(slots).toContainEqual({ item: notedItem, quantity: 3 });
            expect(slots).toContainEqual({ item: notableItem, quantity: -1 });
        });

        it('should throw an error if the item is unnotable', () => {
            inventory.moveItem(stackableItem, 1);

            expect(() => { inventory.noteItems(stackableItem, 1); } ).toThrowError();
            expect(inventory.getSlots()).toContainEqual({ item: stackableItem, quantity: 1 });
        });

        it('should throw an error if the item is already noted', () => {
            inventory.moveItem(notedItem, 1);

            expect(() => { inventory.noteItems(notedItem, 1); } ).toThrowError();
            expect(inventory.getSlots()).toContainEqual({ item: notedItem, quantity: 1 });
        });

        it('should throw an error if a noted version of the item can\'t be found', () => {
            inventory.moveItem(unlinkedNotableItem, 1);

            expect(() => { inventory.noteItems(unlinkedNotableItem, 1); } ).toThrowError();
            expect(inventory.getSlots()).toContainEqual({ item: unlinkedNotableItem, quantity: 1 });
        });
    });

        describe('unnoteItems', () => {
        it('should replace 1 noted item with 1 item', () => {
            inventory.moveItem(notedItem, 1);
            const warnings = inventory.unnoteItems(notedItem, 1);
            const slots = inventory.getSlots();

            expect(warnings.length).toStrictEqual(0);
            expect(slots.length).toStrictEqual(1);
            expect(slots).toContainEqual({ item: notableItem, quantity: 1 });
        });

        it('should replace 3 noted items with 3 items', () => {
            inventory.moveItem(notedItem, 3);
            const warnings = inventory.unnoteItems(notedItem, 3);
            const slots = inventory.getSlots();

            expect(warnings.length).toStrictEqual(0);
            expect(slots.length).toStrictEqual(1);
            expect(slots).toContainEqual({ item: notableItem, quantity: 3 });
        });

        it('should replace 2/3 noted items with items and leave 1 untouched', () => {
            inventory.moveItem(notedItem, 3);
            const warnings = inventory.unnoteItems(notedItem, 2);
            const slots = inventory.getSlots();

            expect(warnings.length).toStrictEqual(0);
            expect(slots.length).toStrictEqual(2);
            expect(slots).toContainEqual({ item: notableItem, quantity: 2 });
            expect(slots).toContainEqual({ item: notedItem, quantity: 1 });
        });

        it('should return a warning if the inventory doesn\'t contain the noted item', () => {
            const warnings = inventory.unnoteItems(notedItem, 2);
            const slots = inventory.getSlots();

            expect(warnings.length).toStrictEqual(1);
            expect(warnings[0]).toBeInstanceOf(InventoryMissingItemWarning);
            expect(slots.length).toStrictEqual(2);
            expect(slots).toContainEqual({ item: notableItem, quantity: 2 });
            expect(slots).toContainEqual({ item: notedItem, quantity: -2 });
        });

        it('should return a warning if the inventory doesn\'t contain enough of the noted item', () => {
            inventory.moveItem(notableItem, 2);
            const warnings = inventory.noteItems(notableItem, 3);
            const slots = inventory.getSlots();

            expect(warnings.length).toStrictEqual(1);
            expect(warnings[0]).toBeInstanceOf(InventoryMissingItemWarning);
            expect(slots.length).toStrictEqual(2);
            expect(slots).toContainEqual({ item: notedItem, quantity: 3 });
            expect(slots).toContainEqual({ item: notableItem, quantity: -1 });
        });

        it('should throw an error if the item is already unnoted', () => {
            inventory.moveItem(notableItem, 1);

            expect(() => { inventory.unnoteItems(notableItem, 1); } ).toThrowError();
            expect(inventory.getSlots()).toContainEqual({ item: notableItem, quantity: 1 });
        });

        it('should throw an error if an unnoted version of the item can\'t be found', () => {
            inventory.moveItem(unlinkedNotedItem, 1);

            expect(() => { inventory.noteItems(unlinkedNotedItem, 1); } ).toThrowError();
            expect(inventory.getSlots()).toContainEqual({ item: unlinkedNotedItem, quantity: 1 });
        });
    });

    describe('moveItem', () => {
        it('should be able to fill the inventory in a single move', () => {
            const warnings = inventory.moveItem(unstackableItem, inventory.maxSlots);
            
            expect(warnings).toStrictEqual([]);
            expect(inventory.getUsedSlotsCount()).toStrictEqual(inventory.maxSlots);
        });

        it('should be able to fill the inventory in multiple moves', () => {
            for (let i = 0; i < inventory.maxSlots; i++) {
                const warnings = inventory.moveItem(unstackableItem, 1);
                expect(warnings).toStrictEqual([]);
            }
            expect(inventory.getUsedSlotsCount()).toStrictEqual(inventory.maxSlots);
        });

        it('should be able to empty the inventory in a single move', () => {
            inventory.moveItem(unstackableItem, inventory.maxSlots);
            const warnings = inventory.moveItem(unstackableItem, -inventory.maxSlots);
            
            expect(warnings).toStrictEqual([]);
            expect(inventory.getUsedSlotsCount()).toStrictEqual(0);
        });

        it('should be able to empty the inventory in multiple moves', () => {
            inventory.moveItem(unstackableItem, inventory.maxSlots);
            for (let i = 0; i < inventory.maxSlots; i++) {
                const warnings = inventory.moveItem(unstackableItem, -1);
                expect(warnings).toStrictEqual([]);
            }
            expect(inventory.getUsedSlotsCount()).toStrictEqual(0);
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

            expect(inventory.getUsedSlotsCount()).toStrictEqual(0);
        });

        it('should remove all items from the inventory even if they are exceeding its capacity', () => {
            inventory.moveItem(unstackableItem, inventory.maxSlots);
            inventory.moveItem(stackableItem, inventory.maxSlots * 2);
            inventory.clear();
            
            expect(inventory.getUsedSlotsCount()).toStrictEqual(0);
        });
    });

    describe('getUsedSlotsCount', () => {
        it('should return 0 for a new inventory', () => {
            expect(inventory.getUsedSlotsCount()).toStrictEqual(0);
        });

        it('should return 1 for an inventory missing 1 item', () => {
            inventory.moveItem(unstackableItem, -1);

            expect(inventory.getUsedSlotsCount()).toStrictEqual(1);
        });

        it('should return 1 for an inventory missing 3 unstackable items', () => {
            inventory.moveItem(unstackableItem, -3);

            expect(inventory.getUsedSlotsCount()).toStrictEqual(1);
        });

        it('should return 1 for an inventory missing 3 stackable items', () => {
            inventory.moveItem(stackableItem, -3);

            expect(inventory.getUsedSlotsCount()).toStrictEqual(1);
        });

        it('should accurately count 11 unstackable items', () => {
            inventory.moveItem(unstackableItem, 11);

            expect(inventory.getUsedSlotsCount()).toStrictEqual(11);
        });

        it('should accurately count 7 noted items as 1', () => {
            inventory.moveItem(notedItem, 7);

            expect(inventory.getUsedSlotsCount()).toStrictEqual(1);
        });

        it('should accurately count 9 stackable items as 1', () => {
            inventory.moveItem(stackableItem, 9);

            expect(inventory.getUsedSlotsCount()).toStrictEqual(1);
        });

        it('should accurately count a full inventory of unstackable items', () => {
            inventory.moveItem(unstackableItem, inventory.maxSlots);

            expect(inventory.getUsedSlotsCount()).toStrictEqual(inventory.maxSlots);
        });

        it('should accurately count an inventory exceeding its limit', () => {
            inventory.moveItem(unstackableItem, inventory.maxSlots * 2);

            expect(inventory.getUsedSlotsCount()).toStrictEqual(inventory.maxSlots * 2);
        });
    });

    describe('getItemVariation', () => {
        const coinsItems = ItemStore.fromJSON(coinsJson);

        it('should return the stored base item if passing a variation of it', () => {
            const baseCoin = coinsItems[995];
            const coinVariation = coinsItems[1000];
            inventory.moveItem(baseCoin, 1);

            expect(inventory.getItemVariation(coinVariation)).toStrictEqual(inventory.getSlots()[0]);
        });

        it('should return the stored variation item if passing a its base version', () => {
            const baseCoin = coinsItems[995];
            const coinVariation = coinsItems[1000];
            inventory.moveItem(coinVariation, 25);

            expect(inventory.getItemVariation(baseCoin)).toStrictEqual(inventory.getSlots()[0]);
        });

        it('should return undefined if passing a variation of an item not stored', () => {
            const coinVariation = coinsItems[1000];
            inventory.moveItem(stackableItem, 1);

            expect(inventory.getItemVariation(coinVariation)).toStrictEqual(undefined);
        });
    });
});