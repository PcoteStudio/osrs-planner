export class XpTable {
  xpTable: number[];

  constructor(public maxLevel: number) {
    this.xpTable = new Array<number>(maxLevel);
    let previousLevel = 0;
    this.xpTable[0] = Math.floor(previousLevel);
    for (let i = 1; i < this.xpTable.length; i++) {
      previousLevel = previousLevel + Math.floor(i + 300 * Math.pow(2, i / 7)) / 4;
      this.xpTable[i] = Math.floor(previousLevel);
    }
  }

  public getXp(level: number): number | undefined {
    return this.xpTable[level - 1];
  }

  public getLevel(xp: number): number {
    let level = 1;
    while (level < this.xpTable.length && xp >= this.xpTable[level]) {
      level++;
    }
    return level;
  }
}