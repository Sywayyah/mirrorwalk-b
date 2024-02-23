enum EntityPrefix {
  Hero = 'hero',
  Unit = 'ut',
  Item = 'item',
  Spell = 'spell',
  Struct = 'struct',
}

export type SpellId = `#${EntityPrefix.Spell}-${string}`;
export type UnitId = `#${EntityPrefix.Unit}-${string}`;
export type HeroId = `#${EntityPrefix.Hero}-${string}`;
export type ItemId = `#${EntityPrefix.Item}-${string}`;
export type StructId = `#${EntityPrefix.Struct}-${string}`;
