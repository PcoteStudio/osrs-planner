import { describe, expect, it } from 'vitest';
import { XpHelper } from '../../../../../src/models/skill/xpHelper';

describe('xpHelper', () => {
    describe('getXpTable', () => {
        it('should provide the 99 XP Table', () => {
            expect(XpHelper.getXpTable(99).maxLevel).toStrictEqual(99);
        });
        it('should provide the 126 XP Table', () => {
            expect(XpHelper.getXpTable(126).maxLevel).toStrictEqual(126);
        });
    });

    describe('getXp', () => {
        it('should return the right xp value for level 1', () => {
            expect(XpHelper.getXp(1)).toStrictEqual(0);
        });
        it('should return the right xp value for level 2', () => {
            expect(XpHelper.getXp(2)).toStrictEqual(83);
        });
        it('should return the right xp value for level 3', () => {
            expect(XpHelper.getXp(3)).toStrictEqual(174);
        });
        it('should return the right xp value for level 50', () => {
            expect(XpHelper.getXp(50)).toStrictEqual(101333);
        });
        it('should return the right xp value for level 98', () => {
            expect(XpHelper.getXp(98)).toStrictEqual(11805606);
        });
        it('should return the right xp value for level 99', () => {
            expect(XpHelper.getXp(99)).toStrictEqual(13034431);
        });
        it('should return the right xp value for level 126', () => {
            expect(XpHelper.getXp(126, 126)).toStrictEqual(188884740);
        });
        it('should return undefined for level 0 or lower', () => {
            expect(XpHelper.getXp(0)).toStrictEqual(undefined);
        });
        it('should return undefined for levels higher than the max', () => {
            expect(XpHelper.getXp(100)).toStrictEqual(undefined);
        });
    });

    describe('getLevel', () => {
        it('should return the right level for 0 xp', () => {
            expect(XpHelper.getLevel(0)).toStrictEqual(1);
        });
        it('should return the right level for 82 xp', () => {
            expect(XpHelper.getLevel(82)).toStrictEqual(1);
        });
        it('should return the right level for 83 xp', () => {
            expect(XpHelper.getLevel(83)).toStrictEqual(2);
        });
        it('should return the right level for 173 xp', () => {
            expect(XpHelper.getLevel(173)).toStrictEqual(2);
        });
        it('should return the right level for 174 xp', () => {
            expect(XpHelper.getLevel(174)).toStrictEqual(3);
        });
        it('should return the right level for 101 400 xp', () => {
            expect(XpHelper.getLevel(101400)).toStrictEqual(50);
        });
        it('should return the right level for 13 034 430 xp', () => {
            expect(XpHelper.getLevel(13034430)).toStrictEqual(98);
        });
        it('should return the right level for 13 034 431 xp', () => {
            expect(XpHelper.getLevel(13034431)).toStrictEqual(99);
        });
        it('should return the right level for 200 000 000 xp', () => {
            expect(XpHelper.getLevel(200000000)).toStrictEqual(99);
        });
    });

    describe('getXpUntilNextLevel', () => {
        it('should return the right xp until level 2 at 0 xp', () => {
            expect(XpHelper.getXpUntilNextLevel(0)).toStrictEqual(83);
        });
        it('should return the right xp until level 3 at 100 xp', () => {
            expect(XpHelper.getXpUntilNextLevel(100)).toStrictEqual(74);
        });

        it('should return the right xp until level 99 at 13 000 000 xp', () => {
            expect(XpHelper.getXpUntilNextLevel(13_000_000)).toStrictEqual(34431);
        });

        it('should return the undefined xp until level 100 at 13 100 000 xp', () => {
            expect(XpHelper.getXpUntilNextLevel(13_100_000, 99)).toStrictEqual(undefined);
        });
    });
});