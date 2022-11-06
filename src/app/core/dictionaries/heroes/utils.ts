import { HeroModel as HeroModelBase, HeroModelStats } from "../../model/hero.model";
import { ResourcesModel } from "../../model/resources.types";

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

export const createHeroModelBase: (heroConfig: Pick<HeroModelBase, 'name'> & HeroModelStats) => HeroModelBase = (
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


