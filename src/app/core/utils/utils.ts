export const CommonUtils = {
  randIndex<T>(array: Array<T>): number {
    return Math.round((array.length - 1) * Math.random());
  },

  randItem<T>(array: Array<T>): T {
    return array[this.randIndex(array)];
  },

  randIntInRange(from: number, to: number): number {
    const diff = to - from;

    return Math.round(from + (diff * Math.random()));
  },

  randIntTo(to: number): number {
    return Math.round(to * Math.random());
  },

  removeItem<T>(arr: T[], item: T): void {
    if (arr.indexOf(item) === -1) {
      return;
    }
    const itemIndex = arr.indexOf(item);
    arr.splice(itemIndex, 1);
  },

  randBoolean(): boolean {
    return Math.random() > 0.5;
  },

  chanceRoll(chance: number): boolean {
    return Math.random() < chance;
  },

  /** Keep percent below max percent */
  maxPercent(percent: number, maxPercent = 1): number {
    return percent > maxPercent ? percent : 0;
  },

  nonNegative(val: number): number {
    return val < 0 ? 0 : val;
  },

  getRandomItems<T>(items: T[], count: number): T[] {
    const itemsLeft = [...items];
    const result = [];

    while (count && itemsLeft.length) {
      const [item] = itemsLeft.splice(CommonUtils.randIndex(itemsLeft), 1);

      result.push(item);

      count--;
    }

    return result;
  }

};

export function getLast<T>(items: T[]): T {
  return items[items.length - 1];
}

export function getFirst<T>(items: T[]): T {
  return items[0];
}
