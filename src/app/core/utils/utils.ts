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
    const itemIndex = arr.indexOf(item);
    arr.splice(itemIndex, 1);
  },

  randBoolean(): boolean {
    return Math.random() > 0.5;
  },

  chanceRoll(chance: number): boolean {
    return Math.random() < chance;
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
