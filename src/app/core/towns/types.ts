
export interface TownBase {
  name: string;
}

const castleTownBase = {
  name: 'Castle',
  buildings: [
    { name: 'Town Center', },
    { name: 'Market', },

    { name: 'School of Magic', },
    { name: 'Tavern' },

    { name: 'Halls of Fate' },

    { name: 'Training Camp', },
    { name: 'Archers Outpost', },
    { name: 'Halls of Knights', },
    { name: 'Cavalry Stalls', },
    { name: 'Magic Tower', },
  ],
};

const castleTown = {
  base: castleTownBase,
  buildings: [],
};
