import { beforeEach, describe, expect, it } from 'vitest';
import { SkillsEnum } from '@/models/skill/skillsEnum';
import { Skills } from '@/models/skill/skills';

describe('Skills', () => {
  let skills: Skills;
  const maxExperience = 200_000_000;

  beforeEach(() => {
    skills = new Skills();
  });

  describe('constructor', () => {
    it('should instanciate every skill at their base value', () => {
      expect(Object.keys(skills.skills).length).toStrictEqual(23);
      for (const skill of Object.values(SkillsEnum)) {
        if(skill === SkillsEnum.Hitpoints)
          expect(skills.getSkillExperience(skill)).toStrictEqual(1154);
        else
          expect(skills.getSkillExperience(skill)).toStrictEqual(0);
      }
      expect(skills.getTotalExperience()).toStrictEqual(1154);
      expect(skills.getTotalLevel()).toStrictEqual(32);
    });
  });

  describe('getSkillLevel', () => {
    it('should return 1 for every skill except hitpoints on a new instance', () => {
      for (const skill of Object.values(SkillsEnum)) {
        if(skill === SkillsEnum.Hitpoints)
          expect(skills.getSkillLevel(skill)).toStrictEqual(10);
        else
          expect(skills.getSkillLevel(skill)).toStrictEqual(1);
      }
    });

    it('should return an increased level on the right experience amount', () => {
      expect(skills.getSkillLevel(SkillsEnum.Hitpoints)).toStrictEqual(10);
      skills.addSkillExperience(SkillsEnum.Hitpoints, 203);
      expect(skills.getSkillLevel(SkillsEnum.Hitpoints)).toStrictEqual(10);
      skills.addSkillExperience(SkillsEnum.Hitpoints, 1);
      expect(skills.getSkillLevel(SkillsEnum.Hitpoints)).toStrictEqual(11);
    });

    it('should return 99 for skills above 99', () => {
      skills.setSkillExperience(SkillsEnum.Attack, maxExperience);
      expect(skills.getSkillLevel(SkillsEnum.Attack)).toStrictEqual(99);
    });

    it('should return up to 126 for skills above 99 when virtual is enabled', () => {
      skills.setSkillExperience(SkillsEnum.Attack, maxExperience);
      expect(skills.getSkillLevel(SkillsEnum.Attack, true)).toStrictEqual(126);
    });
  });

  describe('getSkillExperience', () => {
    it('should return 0 for every skill except hitpoints on a new instance', () => {
      for (const skill of Object.values(SkillsEnum)) {
        if(skill === SkillsEnum.Hitpoints)
          expect(skills.getSkillExperience(skill)).toStrictEqual(1154);
        else
          expect(skills.getSkillExperience(skill)).toStrictEqual(0);
      }
    });

    it('should return the current experience value for a skill', () => {
      expect(skills.getSkillExperience(SkillsEnum.Defence)).toStrictEqual(0);
      skills.addSkillExperience(SkillsEnum.Defence, 1);
      expect(skills.getSkillExperience(SkillsEnum.Defence)).toStrictEqual(1);
      skills.addSkillExperience(SkillsEnum.Defence, 631);
      expect(skills.getSkillExperience(SkillsEnum.Defence)).toStrictEqual(632);
    });

    it('should never return above the max amount of experience', () => {
      skills.setSkillExperience(SkillsEnum.Farming, maxExperience * 2);
      expect(skills.getSkillExperience(SkillsEnum.Farming)).toStrictEqual(maxExperience);
    });
  });

  describe('setSkillExperience', () => {
    it('should set current experience value for a skill', () => {
      expect(skills.getSkillExperience(SkillsEnum.Firemaking)).toStrictEqual(0);
      skills.setSkillExperience(SkillsEnum.Firemaking, 1);
      expect(skills.getSkillExperience(SkillsEnum.Firemaking)).toStrictEqual(1);
      skills.setSkillExperience(SkillsEnum.Firemaking, 631);
      expect(skills.getSkillExperience(SkillsEnum.Firemaking)).toStrictEqual(631);
    });

    it('should set the max amount of experience when going over', () => {
      skills.setSkillExperience(SkillsEnum.Prayer, maxExperience + 3);
      expect(skills.getSkillExperience(SkillsEnum.Prayer)).toStrictEqual(maxExperience);
    });
  });

  describe('addSkillExperience', () => {
    it('should add to the current experience value for a skill', () => {
      expect(skills.getSkillExperience(SkillsEnum.Thieving)).toStrictEqual(0);
      skills.addSkillExperience(SkillsEnum.Thieving, 1);
      expect(skills.getSkillExperience(SkillsEnum.Thieving)).toStrictEqual(1);
      skills.addSkillExperience(SkillsEnum.Thieving, 631);
      expect(skills.getSkillExperience(SkillsEnum.Thieving)).toStrictEqual(632);
    });

    it('should only add up the max amount of experience', () => {
      skills.addSkillExperience(SkillsEnum.Smithing, maxExperience + 1);
      expect(skills.getSkillExperience(SkillsEnum.Smithing)).toStrictEqual(maxExperience);
    });
  });

  describe('getTotalExperience', () => {
    it('should return 1154 on a new instance', () => {
      expect(skills.getTotalExperience()).toStrictEqual(1154);
    });

    it('should return an increasing number for every skill gaining xp', () => {
      let totalXp = 1154;
      for (const skill of Object.values(SkillsEnum)) {
        skills.addSkillExperience(skill, 124);
        totalXp += 124;
        expect(skills.getTotalExperience()).toStrictEqual(totalXp);
      }
    });

    it('should return 4_600_000_000 for a maxed account', () => {
      for (const skill of Object.values(SkillsEnum))
        skills.setSkillExperience(skill, maxExperience);
      expect(skills.getTotalExperience()).toStrictEqual(23 * maxExperience);
    });
  });

  describe('getTotalLevel', () => {
    it('should return 32 on a new instance', () => {
      expect(skills.getTotalLevel()).toStrictEqual(32);
      expect(skills.getTotalLevel(true)).toStrictEqual(32);
    });

    it('should return an increasing number for every skill leveling up', () => {
      let totalLevel = 32;
      for (const skill of Object.values(SkillsEnum)) {
        if(skill === SkillsEnum.Hitpoints)
          skills.addSkillExperience(skill, 204);
        else
          skills.addSkillExperience(skill, 83);
        totalLevel++;
        expect(skills.getTotalLevel()).toStrictEqual(totalLevel);
      }
    });

    it('should return 99 for skills above 99', () => {
      skills.setSkillExperience(SkillsEnum.Fletching, maxExperience);
      expect(skills.getTotalLevel()).toStrictEqual(32 + 98);
    });

    it('should return up to 126 for skills above 99 when virtual is enabled', () => {
      skills.setSkillExperience(SkillsEnum.Agility, maxExperience);
      expect(skills.getTotalLevel(true)).toStrictEqual(32 + 125);
    });

    it('should return 2277 for a maxed account', () => {
      for (const skill of Object.values(SkillsEnum))
        skills.setSkillExperience(skill, maxExperience);
      expect(skills.getTotalLevel()).toStrictEqual(2277);
    });

    it('should return 2277 for a maxed account when virtual is enabled', () => {
      for (const skill of Object.values(SkillsEnum))
        skills.setSkillExperience(skill, maxExperience);
      expect(skills.getTotalLevel(true)).toStrictEqual(2898);
    });
  });

  describe('clone', () => {
    it('should return an identical copy', () => {
      skills.setSkillExperience(SkillsEnum.Construction, 7852);
      skills.setSkillExperience(SkillsEnum.Hunter, 200_000_000);
      skills.setSkillExperience(SkillsEnum.Strength, 1);
      const skillsClone = skills.clone();

      expect(skillsClone.skills).toStrictEqual(skills.skills);
      expect(skillsClone.getTotalExperience()).toStrictEqual(skills.getTotalExperience());
    });

    it('should return a copy that does not mutate the original', () => {
      skills.setSkillExperience(SkillsEnum.Cooking, 30_000);
      const skillsClone = skills.clone();
      skills.addSkillExperience(SkillsEnum.Cooking, 11_111);

      expect(skillsClone.getSkillExperience(SkillsEnum.Cooking)).toStrictEqual(30_000);
      expect(skills.getSkillExperience(SkillsEnum.Cooking)).toStrictEqual(30_000 + 11_111);
    });
  });
});