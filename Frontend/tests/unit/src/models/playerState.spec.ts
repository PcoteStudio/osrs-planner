import { describe, expect, it } from 'vitest';
import { PlayerState } from '../../../../src/models/playerState';
import { SkillsEnum } from '../../../../src/models/skill/skillsEnum';

describe('PlayerState', () => {
    describe('constructor', () => {
        it('should instanciate every skill at their base value', () => {
            const playerState = new PlayerState();
            expect(Object.keys(playerState.skills).length).toStrictEqual(23);
            expect(playerState.skills[SkillsEnum.Hitpoints]).toStrictEqual(1154);
            expect(playerState.getTotalExperience()).toStrictEqual(1154);
            expect(playerState.getTotalLevel()).toStrictEqual(32);
        });
    });
});