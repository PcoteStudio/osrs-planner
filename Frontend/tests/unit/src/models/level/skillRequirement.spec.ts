import { describe, expect, it } from 'vitest';
import { SkillRequirement } from '@/models/skill/skillRequirement';
import { SkillsEnum } from '@/models/skill/skillsEnum';
import { PlayerState } from '@/models/playerState';

describe('SkillRequirement', () => {
  describe('isMet', () => {
    it('should return true if skill requirement is met', () => {
      const requirement = new SkillRequirement(SkillsEnum.Attack, 420);
      const playerState = new PlayerState();
      playerState.skills[SkillsEnum.Attack] = 420;
      expect(requirement.isMet(playerState)).toEqual(true);
    });
    it('should return true if skill requirement is exceeded', () => {
      const requirement = new SkillRequirement(SkillsEnum.Herblore, 5260);
      const playerState = new PlayerState();
      playerState.skills[SkillsEnum.Herblore] = 5261;
      expect(requirement.isMet(playerState)).toEqual(true);
    });
    it('should return false if skill requirement is not met', () => {
      const requirement = new SkillRequirement(SkillsEnum.Thieving, 25);
      const playerState = new PlayerState();
      playerState.skills[SkillsEnum.Thieving] = 24;
      expect(requirement.isMet(playerState)).toEqual(false);
    });
  });
});