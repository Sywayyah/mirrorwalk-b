import { CommonUtils } from "./utils";

export const SignalArrUtils = {
  addItem: <T>(item: T) => (arr: T[]): T[] => {
    return [...arr, item];
  },
  removeItem: <T>(item: T) => (arr: T[]): T[] => {
    return CommonUtils.removeItemCopy(arr, item);
  },
};
