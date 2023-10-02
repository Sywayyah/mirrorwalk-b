export const iconElem = (iconName: string) => `<i class="ra ra-${iconName}"></i>`;

export const actionIcon = (points: number) => iconElem('feather-wing') + points;
export const manaIcon = (points: number) => iconElem('crystal-ball') + points;
