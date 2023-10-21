import { ActionCard } from '../action-cards';

export const uiPercent = (chanceNumber: number): string => `${Math.round(chanceNumber * 100)}`;
export const uiPercentSign = (chanceNumber: number): string => `${Math.round(chanceNumber * 100)}%`;

export const uiValueRange = (min: number, max: number) => min === max ? `${min} ` : `${min}-${max} `;

export const uiSignedNum = (num: number) => num === 0 ? num : num > 0 ? `+${num}` : `-${num}`;
