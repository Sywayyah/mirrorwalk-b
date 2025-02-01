// todo: functions/constants

function createAssetPathFn(path: string): (img: string) => string {
  return (img: string, ext = 'png') => `${path}${img}.${ext}`;
}

const units = createAssetPathFn('units/');
const heroes = createAssetPathFn('heroes/');
const resources = createAssetPathFn('resources/');

export const AssetsImages = {
  UnitMelee: units('common-melee'),
  UnitRanged: units('common-ranged'),
  FireBird: units('fire-bird'),
  Archer: units('archer'),
  Pikemen: units('pikemen'),

  HeroMelee: heroes('hero-melee'),
  HeroMage: heroes('hero-mage'),
  HeroKnight: heroes('hero-knight'),

  HeroTaltir: heroes('hero-taltir'),
  HeroHelvetica: heroes('hero-helvetica'),
  HeroBlackbird: heroes('hero-blackbird'),

  // resources
  Gold: resources('gold'),
  Wood: resources('wood'),
  Gems: resources('gems'),
  Crystals: resources('crystals'),
};

export type ImgIconSize = 24 | 32 | 48 | 64 | 82 | 128 | 182;

export const ImgIconsPaths = {
  gold: AssetsImages.Gold,
  wood: AssetsImages.Wood,
  gems: AssetsImages.Gems,
  crystals: AssetsImages.Crystals,
} as const;

export type ImgIconName = keyof typeof ImgIconsPaths;
