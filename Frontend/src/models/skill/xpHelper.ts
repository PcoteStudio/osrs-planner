import { XpTable } from './xpTable';

export class XpHelper {
  private static xpTables: { [maxLevel: number]: XpTable } = {};

  static getXpTable(maxLevel: number) {
    let table = this.xpTables[maxLevel];
    if (!table)
      table = this.xpTables[maxLevel] = new XpTable(maxLevel);
    return table;
  }

  static getLevel(xp: number, maxLevel: number = 99): number {
    return this.getXpTable(maxLevel).getLevel(xp);
  }

  static getXp(level: number, maxLevel: number = 99): number | undefined {
    return this.getXpTable(maxLevel).getXp(level);
  }

  static getXpUntilNextLevel(xp: number, maxLevel: number = 99): number | undefined {
    const xpTable = this.getXpTable(maxLevel);
    const currentLevel = xpTable.getLevel(xp);
    const nextXpThreshold = xpTable.getXp(currentLevel + 1);
    return nextXpThreshold ? nextXpThreshold - xp : undefined;
  }
}