import { describe, expect, it } from 'vitest';
import { SkillEffect } from '../../../../src/models/skill/skillEffect';
import { SkillsEnum } from '../../../../src/models/skill/skillsEnum';
import { PlayerState } from '../../../../src/models/playerState';
import { Step } from '../../../../src/models/step';

describe('step', () => {

    describe('toJSON', () => {
        it('should only save specific properties', () => {
            const step = new Step('myDescription');
            step.addEffect(new SkillEffect(SkillsEnum.Attack, 42));
            step.completed = true;
            step.resultingState = new PlayerState();

            const json = step.toJSON();
            const savedProperties: any = JSON.parse(json);
            expect(Object.keys(savedProperties).length).toStrictEqual(3);
            expect(savedProperties.description).not.toBe(undefined);
            expect(savedProperties.effects).not.toBe(undefined);
            expect(savedProperties.completed).not.toBe(undefined);
        });
    });
});