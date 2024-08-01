import { describe, expect, it } from 'vitest'
import { XpTable } from '../../../../src/models/level/xpTable'

describe('xpTable', () => {
    const xpTable99 = new XpTable(99);
    const xpTable126 = new XpTable(126);

    describe('getXp', () => {
        it('should return the right xp value for level 1', () => {
            expect(xpTable99.getXp(1)).toEqual(0);
        });
        it('should return the right xp value for level 2', () => {
            expect(xpTable99.getXp(2)).toEqual(83);
        });
        it('should return the right xp value for level 3', () => {
            expect(xpTable99.getXp(3)).toEqual(174);
        });
        it('should return the right xp value for level 50', () => {
            expect(xpTable99.getXp(50)).toEqual(101333);
        });
        it('should return the right xp value for level 98', () => {
            expect(xpTable99.getXp(98)).toEqual(11805606);
        });
        it('should return the right xp value for level 99', () => {
            expect(xpTable99.getXp(99)).toEqual(13034431);
        });
        it('should return the right xp value for level 126', () => {
            expect(xpTable126.getXp(126)).toEqual(188884740);
        });
        it('should return undefined for level 0 or lower', () => {
            expect(xpTable99.getXp(0)).toEqual(undefined);
        });
        it('should return undefined for levels higher than the max', () => {
            expect(xpTable99.getXp(100)).toEqual(undefined);
        });
    });

    describe('getLevel', () => {
        it('should return the right level for 0 xp', () => {
            expect(xpTable99.getLevel(0)).toEqual(1);
        });
        it('should return the right level for 82 xp', () => {
            expect(xpTable99.getLevel(82)).toEqual(1);
        });
        it('should return the right level for 83 xp', () => {
            expect(xpTable99.getLevel(83)).toEqual(2);
        });
        it('should return the right level for 173 xp', () => {
            expect(xpTable99.getLevel(173)).toEqual(2);
        });
        it('should return the right level for 174 xp', () => {
            expect(xpTable99.getLevel(174)).toEqual(3);
        });
        it('should return the right level for 101 400 xp', () => {
            expect(xpTable99.getLevel(101400)).toEqual(50);
        });
        it('should return the right level for 13 034 430 xp', () => {
            expect(xpTable99.getLevel(13034430)).toEqual(98);
        });
        it('should return the right level for 13 034 431 xp', () => {
            expect(xpTable99.getLevel(13034431)).toEqual(99);
        });
        it('should return the right level for 200 000 000 xp', () => {
            expect(xpTable99.getLevel(200000000)).toEqual(99);
        });
    });
});