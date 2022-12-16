import { ResourcesModel } from '../resources';
import { HeroBase, HeroBaseStats } from './types';

export const heroesDefaultResources: ResourcesModel = {
  gems: 0,
  gold: 1250,
  redCrystals: 0,
  wood: 0,
};

export const EMPTY_RESOURCES: ResourcesModel = {
  gems: 0,
  gold: 0,
  redCrystals: 0,
  wood: 0,
};

export const createHeroModelBase: (heroConfig: Pick<HeroBase, 'name'> & HeroBaseStats) => HeroBase = (
  heroConfig,
) => {
  const {
    abilities,
    army,
    items,
    name,
    resources,
    stats,
  } = heroConfig;

  return {
    name,
    initialState: {
      abilities,
      army,
      items,
      resources,
      stats,
    },
  };
};

