import { describe, expect, it } from 'vitest';
import { SkillRequirement } from '../../../../../src/models/skill/skillRequirement';
import { Skills } from '../../../../../src/models/skill/skills';
import { PlayerState } from '../../../../../src/models/playerState';

describe('SkillRequirement', () => {
    describe('isMet', () => {
        it('should return true if skill requirement is met', () => {
            const requirement = new SkillRequirement(Skills.Attack, 420);
            const playerState = new PlayerState();
            playerState.skills[Skills.Attack] = 420;
            expect(requirement.isMet(playerState)).toEqual(true);
        });
        it('should return true if skill requirement is exceeded', () => {
            const requirement = new SkillRequirement(Skills.Herblore, 5260);
            const playerState = new PlayerState();
            playerState.skills[Skills.Herblore] = 5261;
            expect(requirement.isMet(playerState)).toEqual(true);
        });
        it('should return false if skill requirement is not met', () => {
            const requirement = new SkillRequirement(Skills.Thieving, 25);
            const playerState = new PlayerState();
            playerState.skills[Skills.Thieving] = 24;
            expect(requirement.isMet(playerState)).toEqual(false);
        });
    });
});