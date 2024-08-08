import { describe, expect, it } from 'vitest';
import { SkillEffect } from '@/models/skill/skillEffect';
import { SkillsEnum } from '@/models/skill/skillsEnum';
import { PlayerState } from '@/models/playerState';
import { Step } from '@/models/step';

describe('step', () => {

    describe('toJSON', () => {
        it('should only save specific properties', () => {
            const step = new Step('myDescription');
            step.addEffect(new SkillEffect(SkillsEnum.Attack, 42));
            step.completed = true;
            step.resultingState = new PlayerState();

            const json = JSON.stringify(step);
            const savedProperties: any = JSON.parse(json);
            expect(Object.keys(savedProperties).length).toStrictEqual(4);
            expect(savedProperties.id).not.toBe(undefined);
            expect(savedProperties.description).not.toBe(undefined);
            expect(savedProperties.effects).not.toBe(undefined);
            expect(savedProperties.completed).not.toBe(undefined);
        });
    });
});