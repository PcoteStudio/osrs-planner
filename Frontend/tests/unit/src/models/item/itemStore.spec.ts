import { describe, expect, it } from 'vitest';
import { ItemStore } from '@/models/item/itemStore';
import coinsJson from '../../../../data/coins.json';

describe('itemStore', () => {
  describe('fromJSON', () => {
    it('should return a dictionary of complete items', () => {
      const items = ItemStore.fromJSON(coinsJson);
      expect(Object.keys(items).length).toStrictEqual(11);
      expect(items[995].linkedPlaceholder?.linkedItem?.id).toStrictEqual(995);
    });
  });
});