import { beforeEach, describe, expect, it } from 'vitest';
import { PlayerState } from '@/models/playerState';
import { SkillsEnum } from '@/models/skill/skillsEnum';
import { InventoryMissingItemWarning } from '@/models/item/inventory';
import { Item } from '@/models/item/item';

describe('PlayerState', () => {
  let playerState: PlayerState;

  beforeEach(() => {
    playerState = new PlayerState();
  });

  describe('constructor', () => {
    it('should instanciate every skill at their base value', () => {
      expect(Object.keys(playerState.skills).length).toStrictEqual(23);
      expect(playerState.skills[SkillsEnum.Hitpoints]).toStrictEqual(1154);
      expect(playerState.getTotalExperience()).toStrictEqual(1154);
      expect(playerState.getTotalLevel()).toStrictEqual(32);
    });

    it('should instanciate with 0 warning', () => {
      expect(playerState.warnings.length).toStrictEqual(0);
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