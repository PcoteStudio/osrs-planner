import { describe, expect, it } from 'vitest';
import { ItemStore } from '@/models/item/itemStore';
import itemsJson from '../../../../data/items-complete.json';

describe('itemStore performance test', () => {
  it('load all OSRS items', () => {
    const timestampStart = performance.now();
    ItemStore.items = ItemStore.fromJSON(itemsJson);
    const timestampStop = performance.now();
    expect(Object.values(ItemStore.items).length).toStrictEqual(24735);

    const duration = (start: number, end: number) => ((end - start)).toPrecision(4);
    console.log(`Loaded all items:\t${duration(timestampStart, timestampStop)} ms`);
  });
});