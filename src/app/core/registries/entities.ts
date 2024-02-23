enum EntityPrefix {
  Hero = 'hero',
  Unit = 'ut',
  Item = 'item',
  Spell = 'spell',
  Struct = 'struct',
  Faction = 'faction',
  Town = 'town',
}

export type SpellId = `#${EntityPrefix.Spell}-${string}`;
export type UnitId = `#${EntityPrefix.Unit}-${string}`;
export type HeroId = `#${EntityPrefix.Hero}-${string}`;
export type ItemId = `#${EntityPrefix.Item}-${string}`;
export type StructId = `#${EntityPrefix.Struct}-${string}`;
export type FactionId = `#${EntityPrefix.Faction}-${string}`;
export type TownId = `#${EntityPrefix.Town}-${string}`;
