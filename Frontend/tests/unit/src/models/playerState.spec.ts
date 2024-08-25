import { beforeEach, describe, expect, it } from 'vitest';
import { PlayerState } from '@/models/playerState';
import { Inventory, InventoryMissingItemWarning } from '@/models/item/inventory';
import { Item } from '@/models/item/item';
import { Bank } from '@/models/item/bank';
import { Equipment } from '@/models/item/equipment';
import { Skills } from '@/models/skill/skills';

describe('PlayerState', () => {
  let playerState: PlayerState;

  beforeEach(() => {
    playerState = new PlayerState();
  });

  describe('constructor', () => {
    it('should instanciate the bank', () => {
      expect(playerState.bank).toBeInstanceOf(Bank);
    });

    it('should instanciate the inventory', () => {
      expect(playerState.inventory).toBeInstanceOf(Inventory);
    });

    it('should instanciate the equipment', () => {
      expect(playerState.equipment).toBeInstanceOf(Equipment);
    });

    it('should instanciate the skills', () => {
      expect(playerState.skills).toBeInstanceOf(Skills);
    });

    it('should instanciate an empty warning list', () => {
      expect(playerState.warnings).toStrictEqual([]);
    });
  });

  describe('addWarnings', () => {
    it('should add a single warning', () => {
      const warning1 = new InventoryMissingItemWarning(new Item(1, 'item 1'), 1, 1);
      playerState.addWarnings(warning1);

      expect(playerState.warnings.length).toStrictEqual(1);
      expect(playerState.warnings).toStrictEqual([warning1]);
    });

    it('should add multiple warnings at the same time', () => {
      const warning1 = new InventoryMissingItemWarning(new Item(1, 'item 1'), 1, 1);
      const warning2 = new InventoryMissingItemWarning(new Item(2, 'item 2'), 1, 1);
      playerState.addWarnings(warning1, warning2);

      expect(playerState.warnings.length).toStrictEqual(2);
      expect(playerState.warnings).toStrictEqual([warning1, warning2]);
    });

    it('should add multiple warnings in a row', () => {
      const warning1 = new InventoryMissingItemWarning(new Item(1, 'item 1'), 1, 1);
      const warning2 = new InventoryMissingItemWarning(new Item(2, 'item 2'), 1, 1);
      playerState.addWarnings(warning1);
      playerState.addWarnings(warning2);

      expect(playerState.warnings.length).toStrictEqual(2);
      expect(playerState.warnings).toStrictEqual([warning1, warning2]);
    });

    it('should ignore empty arrays', () => {
      playerState.addWarnings(...[]);

      expect(playerState.warnings.length).toStrictEqual(0);
    });
  });
});