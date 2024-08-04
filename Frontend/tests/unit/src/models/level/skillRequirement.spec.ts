import { describe, expect, it } from 'vitest';
import { SkillRequirementModel } from '../../../../../src/models/skill/skillRequirementModel';
import { SkillsEnum } from '../../../../../src/models/skill/skillsEnum';
import { PlayerStateModel } from '../../../../../src/models/playerStateModel';

describe('SkillRequirement', () => {
    describe('isMet', () => {
        it('should return true if skill requirement is met', () => {
            const requirement = new SkillRequirementModel(SkillsEnum.Attack, 420);
            const playerState = new PlayerStateModel();
            playerState.skills[SkillsEnum.Attack] = 420;
            expect(requirement.isMet(playerState)).toEqual(true);
        });
        it('should return true if skill requirement is exceeded', () => {
            const requirement = new SkillRequirementModel(SkillsEnum.Herblore, 5260);
            const playerState = new PlayerStateModel();
            playerState.skills[SkillsEnum.Herblore] = 5261;
            expect(requirement.isMet(playerState)).toEqual(true);
        });
        it('should return false if skill requirement is not met', () => {
            const requirement = new SkillRequirementModel(SkillsEnum.Thieving, 25);
            const playerState = new PlayerStateModel();
            playerState.skills[SkillsEnum.Thieving] = 24;
            expect(requirement.isMet(playerState)).toEqual(false);
        });
    });
});