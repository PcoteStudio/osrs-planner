import { describe, expect, it } from 'vitest';
import { ItemStore } from '@/models/item/itemStore';
import coinsJson from '../../../../data/coins.json';
import { Item } from '@/models/item/item';

describe('item', () => {
    describe('getItemByStackSize', () => {
        const coinsItems = ItemStore.fromJSON(coinsJson);

        it('should get the smallest coin stack', () => {
            const baseCoin = coinsItems[995];
            const stackedCoin = Item.getItemByStackSize(baseCoin, 1);
            expect(stackedCoin.stackSize).toStrictEqual(1);
        });

        it('should get the smallest coin stack by passing a quantity of 0', () => {
            const baseCoin = coinsItems[995];
            const stackedCoin = Item.getItemByStackSize(baseCoin, 0);
            expect(stackedCoin.stackSize).toStrictEqual(1);
        });

        it('should get the smallest coin stack by passing a higher initial stack', () => {
            const higherCoin = coinsItems[1000];
            const stackedCoin = Item.getItemByStackSize(higherCoin, 1);
            expect(stackedCoin.stackSize).toStrictEqual(1);
        });

        it('should get a stack of 25 coins by passing a quantity of 25', () => {
            const baseCoin = coinsItems[995];
            const stackedCoin = Item.getItemByStackSize(baseCoin, 25);
            expect(stackedCoin.stackSize).toStrictEqual(25);
        });

        it('should get a stack of 25 coins by passing a quantity of 49', () => {
            const baseCoin = coinsItems[995];
            const stackedCoin = Item.getItemByStackSize(baseCoin, 49);
            expect(stackedCoin.stackSize).toStrictEqual(25);
        });

        it('should get the biggest coins stack by passing an higher quantity', () => {
            const baseCoin = coinsItems[995];
            const stackedCoin = Item.getItemByStackSize(baseCoin, 55_555);
            expect(stackedCoin.stackSize).toStrictEqual(10_000);
        });
    });
});