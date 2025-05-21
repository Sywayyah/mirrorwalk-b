export const CommonUtils = {
  selectItems<T>(items: T[], count: number, after = 0): T[] {
    return items.slice(after, after + count);
  },
  randIndex<T>(array: Array<T>): number {
    return Math.round((array.length - 1) * Math.random());
  },

  randItem<T>(array: Array<T>): T {
    return array[this.randIndex(array)];
  },

  randIntInRange(from: number, to: number): number {
    const diff = to - from + 1;

    return Math.floor(from + (diff * Math.random()));
  },

  randIntTo(to: number): number {
    return Math.floor((to + 1) * Math.random());
  },

  removeItem<T>(arr: T[], item: T): void {
    const itemIndex = arr.indexOf(item);
    if (itemIndex === -1) {
      return;
    }
    arr.splice(itemIndex, 1);
  },

  removeItemCopy<T>(arr: T[], item: T): T[] {
    let newArr = [...arr];
    const itemIndex = newArr.indexOf(item);

    if (itemIndex === -1) {
      return newArr;
    }
    newArr.splice(itemIndex, 1);

    return newArr;
  },



  randBoolean(): boolean {
    return Math.random() > 0.5;
  },

  chanceRoll(chance: number): boolean {
    return Math.random() < chance;
  },

  /** Keep percent below max percent */
  maxPercent(percent: number, maxPercent = 1): number {
    return percent > maxPercent ? maxPercent : percent;
  },

  increaseByPercent(val: number, percent: number): number {
    return val + (val * percent);
  },

  nonNegative(val: number): number {
    return val < 0 ? 0 : val;
  },

  limitedNumber(num: number, max: number, min = 0): number {
    return num > max ? max : num < min ? min : num;
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
