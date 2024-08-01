import { describe, expect, it } from 'vitest'
import { XpTable } from '../../../../src/models/level/xpTable'

describe('xpTable', () => {
    const xpTable99 = new XpTable(99);
    const xpTable126 = new XpTable(126);

    describe('get', () => {
        it('should return the right xp value for level 1', () => {
            expect(xpTable99.get(1)).toEqual(0);
        });
        it('should return the right xp value for level 2', () => {
            expect(xpTable99.get(2)).toEqual(83);
        });
        it('should return the right xp value for level 3', () => {
            expect(xpTable99.get(3)).toEqual(174);
        });
        it('should return the right xp value for level 50', () => {
            expect(xpTable99.get(50)).toEqual(101333);
        });
        it('should return the right xp value for level 98', () => {
            expect(xpTable99.get(98)).toEqual(11805606);
        });
        it('should return the right xp value for level 99', () => {
            expect(xpTable99.get(99)).toEqual(13034431);
        });
        it('should return the right xp value for level 126', () => {
            expect(xpTable126.get(126)).toEqual(188884740);
        });
        it('should return undefined for level 0 or lower', () => {
            expect(xpTable99.get(0)).toEqual(undefined);
        });
        it('should return undefined for levels higher than the max', () => {
            expect(xpTable99.get(100)).toEqual(undefined);
        });
    });
});