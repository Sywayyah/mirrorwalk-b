// todo: functions/constants

function createAssetPathFn(path: string): (img: string) => string {
  return (img: string, ext = 'png') => `${path}${img}.${ext}`;
}

const units = createAssetPathFn('units/');
const heroes = createAssetPathFn('heroes/');

export const AssetsImages = {
  UnitMelee: units('common-melee'),
  UnitRanged: units('common-ranged'),
  FireBird: units('fire-bird'),

  HeroMelee: heroes('hero-melee'),
  HeroMage: heroes('hero-mage'),
  HeroKnight: heroes('hero-knight'),

  HeroTaltir: heroes('hero-taltir'),
  HeroHelvetica: heroes('hero-helvetica'),
  HeroBlackbird: heroes('hero-blackbird'),
};
