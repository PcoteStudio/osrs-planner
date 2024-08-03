import { describe, expect, it } from 'vitest';
import { SkillRequirementModel } from '../../../../../src/models/skill/skillRequirementModel';
import { SkillsModel } from '../../../../../src/models/skill/skillsModel';
import { PlayerStateModel } from '../../../../../src/models/playerStateModel';

describe('SkillRequirement', () => {
    describe('isMet', () => {
        it('should return true if skill requirement is met', () => {
            const requirement = new SkillRequirementModel(SkillsModel.Attack, 420);
            const playerState = new PlayerStateModel();
            playerState.skills[SkillsModel.Attack] = 420;
            expect(requirement.isMet(playerState)).toEqual(true);
        });
        it('should return true if skill requirement is exceeded', () => {
            const requirement = new SkillRequirementModel(SkillsModel.Herblore, 5260);
            const playerState = new PlayerStateModel();
            playerState.skills[SkillsModel.Herblore] = 5261;
            expect(requirement.isMet(playerState)).toEqual(true);
        });
        it('should return false if skill requirement is not met', () => {
            const requirement = new SkillRequirementModel(SkillsModel.Thieving, 25);
            const playerState = new PlayerStateModel();
            playerState.skills[SkillsModel.Thieving] = 24;
            expect(requirement.isMet(playerState)).toEqual(false);
        });
    });
});