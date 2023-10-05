export const iconElem = (iconName: string) => `<i class="ra ra-${iconName}"></i>`;

export const actionIcon = (points: number) => points + iconElem('feather-wing');
export const manaIcon = (points: number) => points + iconElem('crystal-ball');
