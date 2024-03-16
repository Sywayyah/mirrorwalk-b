import { AssetsImages } from '../assets';
import { registerEntity } from '../entities';
import { ResourcesModel } from '../resources';
import { HeroBase, HeroBaseStats } from './types';

export const heroesDefaultResources: ResourcesModel = {
  gems: 0,
  gold: 1250,
  redCrystals: 0,
  wood: 2,
};

export const EMPTY_RESOURCES: ResourcesModel = {
  gems: 0,
  gold: 0,
  redCrystals: 0,
  wood: 0,
};

export const createHeroModelBase: (heroConfig: Pick<HeroBase, 'name' | 'id'> & HeroBaseStats) => HeroBase = (
  heroConfig,
) => {
  const {
    id,
    abilities,
    army,
    items,
    name,
    resources,
    stats,
    generalDescription,
    image,
  } = heroConfig;

  const heroEntity = {
    id,
    name,
    generalDescription,
    initialState: {
      abilities,
      army,
      items,
      resources,
      stats,
    },
    image: image ?? AssetsImages.HeroMage,
  };

  registerEntity(heroEntity);

  return heroEntity;
};


