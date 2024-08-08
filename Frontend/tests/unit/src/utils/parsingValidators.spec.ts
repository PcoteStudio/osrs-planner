import { describe, expect, it } from 'vitest';
import { validateEnumProperty, validatePropertyIterability, validatePropertyType } from '@/utils/parsingValidators';
import { SkillsEnum } from '@/models/skill/skillsEnum';
import { SkillEffect } from '@/models/skill/skillEffect';
import { Step } from '@/models/step';

describe('parsingValidators', () => {
    describe('validateEnumProperty', () => {
        it('should not throw with a valid SkillEnum in the JSON object', () => {
            validateEnumProperty(SkillEffect, { skill: 'Herblore' }, 'skill', SkillsEnum);
        });

        it('should throw with an invalid SkillEnum in the JSON object', () => {
            expect(() => { validateEnumProperty(SkillEffect, { skill: 'NotASkill' }, 'skill', SkillsEnum); }).toThrow();
        });

        it('should throw if the key is missing from the JSON object', () => {
            expect(() => { validateEnumProperty(SkillEffect, {}, 'skill', SkillsEnum); }).toThrow();
        });

        it('should throw if an empty key is passed to the validator', () => {
            expect(() => { validateEnumProperty(SkillEffect, { skill: 'Herblore' }, '', SkillsEnum); }).toThrow();
        });
    });

    describe('validatePropertyType', () => {
        it('should not throw when the same string type is found in the JSON object', () => {
            validatePropertyType(SkillEffect, { skill: 'Herblore' }, 'skill', 'string');
        });

        it('should not throw when the same number type is found in the JSON object', () => {
            validatePropertyType(SkillEffect, { skill: 0 }, 'skill', 'number');
        });

        it('should not throw when undefined is expected found in the JSON object', () => {
            validatePropertyType(SkillEffect, { skill: undefined }, 'skill', 'number', 'undefined');
        });

        it('should not throw when undefined is expected and null is found in the JSON object', () => {
            validatePropertyType(SkillEffect, { skill: null }, 'skill', 'number', 'undefined');
        });

        it('should throw when a different type is found in the JSON object', () => {
            expect(() => { validatePropertyType(SkillEffect, { skill: 'string' }, 'skill', 'number'); }).toThrow();
        });

        it('should throw if the key is missing from the JSON object', () => {
            expect(() => { validatePropertyType(SkillEffect, {}, 'skill', 'string'); }).toThrow();
        });

        it('should throw if an empty key is passed to the validator', () => {
            expect(() => { validatePropertyType(SkillEffect, { skill: 'Herblore' }, '', 'string'); }).toThrow();
        });
    });

    describe('validatePropertyIterability', () => {
        it('should not throw with a valid array in the JSON object', () => {
            validatePropertyIterability(Step, { effects: ['a', 'b', 'c'] }, 'effects');
        });

        it('should throw without an array in the JSON object', () => {
            expect(() => { validatePropertyIterability(Step, { effects: 6 }, 'effects'); }).toThrow();
        });

        it('should throw with a string in the JSON object', () => {
            expect(() => { validatePropertyIterability(Step, { effects: 'test' }, 'effects'); }).toThrow();
        });

        it('should throw if the key is missing from the JSON object', () => {
            expect(() => { validatePropertyIterability(Step, {}, 'effects'); }).toThrow();
        });

        it('should throw if an empty key is passed to the validator', () => {
            expect(() => { validatePropertyIterability(Step, { effects: ['a', 'b', 'c'] }, ''); }).toThrow();
        });
    });
});