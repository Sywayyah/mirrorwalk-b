enum EntityPrefix {
  Hero = 'hero',
  Unit = 'ut',
  Item = 'item',
  Spell = 'spell'
}

export type SpellId = `#${EntityPrefix.Spell}-${string}`;
export type UnitId = `#${EntityPrefix.Unit}-${string}`;
export type HeroId = `#${EntityPrefix.Hero}-${string}`;
export type ItemId = `#${EntityPrefix.Item}-${string}`;
